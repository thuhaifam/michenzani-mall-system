from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    """
    Custom permission to only allow users with ADMIN role to access.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'ADMIN'

