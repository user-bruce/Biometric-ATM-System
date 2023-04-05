from django.urls import path, include
from .views import (
    AccountHolderApiView,
    AuthApiView,
    SignupApiView,
    TransactionApiView,
    AccountApiView,
)

urlpatterns = [
    path('api/auth', AuthApiView.as_view()),
    path('api/signup', SignupApiView.as_view()),
    path('api/accounts', AccountApiView.as_view()),
    path('api/holder',  AccountHolderApiView.as_view()),
    path('api/transactions', TransactionApiView.as_view())
]
