from django.contrib import admin

from .models import Account, AccountHolder, Transaction

# Register your models here.
admin.site.register(Account)
admin.site.register(AccountHolder)
admin.site.register(Transaction)
