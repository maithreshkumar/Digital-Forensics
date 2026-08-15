from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Unrestricted Admin Access: The logged-in user is always Admin.
    """
    def has_permission(self, request, view):
        return True

class IsInvestigatorOrAdmin(permissions.BasePermission):
    """
    Unrestricted Admin Access: The logged-in user is always Admin.
    """
    def has_permission(self, request, view):
        return True
