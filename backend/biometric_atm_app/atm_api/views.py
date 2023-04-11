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
        result = AccountHolder.objects.all()

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
    def get(self, request,fingerprintID):
        print(fingerprintID)
        holder = AccountHolder.objects.all().filter(fingerprintID=fingerprintID).first()
        print(holder)
        serializer = AccountHolderSerializer(holder, many=False)
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
        print(json.loads(request.body.decode('utf-8')))
        print(transaction['holder'])
        t = Transaction(amount=transaction['amount'],
                         date=transaction['date'],
                           holder=AccountHolder(id=transaction['holder']['id'],
                            fingerprintID=transaction['holder'], pin=transaction['holder']['pin']),
                             account=Account(id=transaction['account']['id'], holder=AccountHolder(id=transaction['holder']['id'], pin=transaction['holder']['pin'],fingerprintID=transaction['holder']), accountName=transaction['account']['accountName'], accountNumber=transaction['account']['accountNumber'], balance=transaction['account']['balance']), transactionType=transaction['transactionType'])
        t.save()
        account = Account.objects.get(id=transaction['account']['id'])
        if transaction['transactionType']=='WITHDRAWAL':
            newBalance = account.balance
            if float(account.balance) > float(transaction['amount']):
                newBalance = float(account.balance) - float(transaction['amount'])
            else:
                return Response({"Error","Insufficient funds"}, status=status.HTTP_406_NOT_ACCEPTABLE)
            account.balance = newBalance
            account.save(update_fields=["balance"])
        else:
            newBalance = float(account.balance) + float(transaction['amount'])
            account.balance = newBalance
            account.save(update_fields=["balance"])
        print("Account to be updated")
        print(account)
        return Response(status=status.HTTP_200_OK)

    # LIST
    def get(self, request, *args, **kwargs):
        print(self.kwargs['clientID'])
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
    #Get the accounts whose holder.fingerprintID=kwargs[clientID]
    def get(self, request, *args, **kwargs):
        print(self.kwargs['clientID'])
        accounts = Account.objects.all()
        print(accounts)
        filteredAccounts = []
        for account in accounts:
            if account.holder.fingerprintID == self.kwargs['clientID']:
              filteredAccounts.append(account)
        print(account);
        accountSerializer = AccountSerializer(accounts, many=True)
        return Response(accountSerializer.data, status=status.HTTP_200_OK)
