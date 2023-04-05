import enum
from django.db import models

# Account Holder


class AccountHolder(models.Model):
    id = models.AutoField(primary_key=True),
    userName = models.CharField(max_length=30)
    pin = models.CharField(max_length=30)

    def __str__(self):
        return self.userName


class Account(models.Model):
    id = models.AutoField(primary_key=True)
    holder = models.ForeignKey(AccountHolder, on_delete=models.DO_NOTHING)
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
    holder = models.ForeignKey(AccountHolder,on_delete=models.DO_NOTHING)
    account = models.ForeignKey(Account, on_delete=models.DO_NOTHING)
    transactionType = models.CharField(
        max_length=20)
