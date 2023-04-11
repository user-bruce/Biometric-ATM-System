import enum
from django.db import models

# Account Holder


class AccountHolder(models.Model):
    id = models.AutoField(primary_key=True)
    fingerprintID=models.IntegerField(max_length=3)
    pin = models.CharField(max_length=30)

    def __str__(self):
        return self.pin


class Account(models.Model):
    id = models.AutoField(primary_key=True)
    holder = models.ForeignKey(AccountHolder, on_delete=models.CASCADE)
    accountName = models.CharField(max_length=30)
    accountNumber = models.CharField(max_length=30)
    balance = models.FloatField(default=0.00)

    def __str__(self):
        return self.accountName


@enum.unique
class AccountType(str, enum.Enum):
    DEPOSIT = 'deposit'
    WITHDRAWAL = 'withdrawal'

    @classmethod
    def choices(cls):
        return [(item.value, item.name) for item in cls]


class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    amount = models.FloatField(default=0.00)
    date = models.CharField(max_length=30)
    holder = models.ForeignKey(AccountHolder, on_delete=models.CASCADE)
    account = models.ForeignKey(Account,on_delete=models.CASCADE)
    transactionType = models.CharField(max_length=20)
