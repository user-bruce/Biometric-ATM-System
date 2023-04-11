from django import urls
from django.urls import path, include, re_path
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
    path('api/accounts/<int:clientID>', AccountApiView.as_view()),
    path('api/holder',  AccountHolderApiView.as_view()),
    path('api/holder/<int:fingerprintID>',  AccountHolderApiView.as_view()),
    path('api/transactions', TransactionApiView.as_view()),
    path('api/transactions/<int:clientID>', TransactionApiView.as_view())
]
