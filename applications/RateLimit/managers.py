from django.db.models import manager

class RateLimitInfoManager(manager.Manager):
    def get_cut_timediff(self):
        pass
    def set_cut_time(self):
        pass