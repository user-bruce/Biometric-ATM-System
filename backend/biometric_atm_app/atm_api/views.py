import json
from django.shortcuts import render, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Account, AccountHolder, Transaction
from django.contrib.auth.hashers import make_password, check_password

from .serializers import AccountHolderSerializer, AccountSerializer, TransactionSerializer


class AuthApiView(APIView):
    def post(self, request, *args, **kwargs):

        password = (json.loads(request.body.decode('utf-8'))['pin'])
        userName = (json.loads(request.body.decode('utf-8'))['userName'])
        result = AccountHolder.objects.all().filter(pin=password).filter(userName=userName)

        serializer = AccountHolderSerializer(result, many=True)
        if result:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class SignupApiView(APIView):
    def post(self, request, *args, **kwargs):

        holder = (json.loads(request.body.decode('utf-8')))
        print(holder)
        print(request.body)
        serializer = AccountHolderSerializer(data=holder)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_200_OK)


class AccountHolderApiView(APIView):

    # CREATE
    def post(self, request, *args, **kwargs):

        serializer = AccountHolderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_200_OK)

    # GET BY ID
    def get(self, request, pk):
        result = AccountHolder.objects.get(pk=pk)
        serializer = AccountHolderSerializer(result, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

 # EDIT (PATCH)

    def patch(self, request, id):
        result = AccountHolder.objects.get(id)
        serializer = AccountHolderSerializer(
            result, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionApiView(APIView):

    # CREATE TRANSACTION
    def post(self, request, *args, **kwargs):
        transaction = (json.loads(request.body.decode('utf-8')))
        serializer = TransactionSerializer(data=transaction);
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_200_OK)

    # GET BY ID
    def get(self, request, pk):
        result = Transaction.objects.get(pk=pk)
        serializer = TransactionSerializer(result, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # LIST
    def get(self, request, *args, **kwargs):
        transactions = Transaction.objects.all()
        transactionSerializer = TransactionSerializer(transactions, many=True)
        return Response(transactionSerializer.data, status=status.HTTP_200_OK)


class AccountApiView(APIView):

    # CREATE TRANSACTION
    def post(self, request, *args, **kwargs):
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_200_OK)

    # # GET BY ID
    # def get(self, request, pk):
    #     result = Account.objects.get(pk=pk)
    #     serializer = AccountSerializer(result, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)

    # LIST
    def get(self, request, *args, **kwargs):
        transactions = Account.objects.all()
        accountSerializer = AccountSerializer(transactions, many=True)
        return Response(accountSerializer.data, status=status.HTTP_200_OK)
