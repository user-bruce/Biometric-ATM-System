from rest_framework import serializers
from .models import Account, AccountHolder, Transaction


class AccountHolderSerializer(serializers.ModelSerializer):

    class Meta:
        model = AccountHolder
        depth = 2
        fields = "__all__"


class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        depth = 2
        fields = "__all__"


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        depth = 2
        fields = ("amount", "holder", "account", "date", "transactionType")
        #fields = "__all__"
