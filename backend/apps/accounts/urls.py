from django.urls import path
from .views import LoginView, UserMeView, LogoutView

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/me/', UserMeView.as_view(), name='auth_me'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
]
