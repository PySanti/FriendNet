from django.db import models

# Create your models here.
class RateLimitInfo(models.Model):
    ip = models.CharField(unique=True)
    banned = models.BooleanField()
    suspended = models.BooleanField()
    calls_in_cut = models.PositiveSmallIntegerField()
    last_cut_time = models.TimeField()
    
    def __str__(self):
        return f"{self.ip} {'banned' if self.banned else 'suspended' if self.suspended else ''}"
