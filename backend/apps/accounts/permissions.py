from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, 'dfir_user', None)
        return user and user.role == 'admin'

class IsInvestigatorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, 'dfir_user', None)
        return user and user.role in ('admin', 'investigator')
