from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Frame, Booking

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'password', 'is_active')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Force the role to BUSINESS for any registrations through the default public endpoint
        # Admins should be created via createsuperuser or directly in the database
        validated_data['role'] = 'BUSINESS'
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return {'user': user}
        raise serializers.ValidationError("Incorrect Credentials")

class FrameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Frame
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    frame_details = FrameSerializer(source='frame', read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'user', 'frame', 'frame_details', 'start_date', 'end_date', 'total_amount', 'is_paid', 'created_at')
        extra_kwargs = {'user': {'read_only': True}}
