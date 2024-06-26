from .managers import RateLimitInfoManager
from django.db import models

# Create your models here.
class RateLimitInfo(models.Model):
    ip = models.CharField(unique=True)
    banned = models.BooleanField(default=False)
    suspended_time = models.DateTimeField(default=None, null=True)
    calls_in_cut = models.PositiveSmallIntegerField(default=0)
    last_cut_time = models.DateTimeField(auto_now_add=True)
    strikes = models.PositiveSmallIntegerField(default=0)
    objects = RateLimitInfoManager()
    def __str__(self):
        return f"{self.ip} {'banned' if self.banned else 'suspended' if self.suspended_time else ''}"
