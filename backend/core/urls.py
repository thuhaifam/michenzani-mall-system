from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views # Changed to import views as a module

# The router is no longer needed if explicit paths are used for frames and bookings
# router = DefaultRouter()
# router.register(r'frames', FrameViewSet)
# router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/users/', views.UserListView.as_view(), name='users-list'), # Added users list URL
    path('frames/', views.FrameViewSet.as_view({'get': 'list', 'post': 'create'}), name='frames-list'),
    path('frames/<int:pk>/', views.FrameViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='frames-detail'),
    path('bookings/', views.BookingViewSet.as_view({'get': 'list', 'post': 'create'}), name='bookings-list'),
    path('bookings/<int:pk>/', views.BookingViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='bookings-detail'),
    # The router include is removed as explicit paths are now defined
    # path('', include(router.urls)),
]
