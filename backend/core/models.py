from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('BUSINESS', 'Business Man'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='BUSINESS')

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = 'ADMIN'
        super().save(*args, **kwargs)

class Frame(models.Model):
    STATUS_CHOICES = (
        ('AVAILABLE', 'Available'),
        ('BOOKED', 'Booked'),
    )
    number = models.CharField(max_length=50, unique=True, help_text="Frame/Shop Number")
    size = models.CharField(max_length=50, help_text="e.g., 20x20 sqft")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Monthly Rent")
    features = models.TextField(help_text="Description of features")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="Frame image URL")

    def __str__(self):
        return f"Frame {self.number} ({self.status})"

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    frame = models.ForeignKey(Frame, on_delete=models.CASCADE, related_name='bookings')
    start_date = models.DateField()
    end_date = models.DateField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking for {self.frame.number} by {self.user.username}"
