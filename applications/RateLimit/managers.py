from django.db.models import manager
from datetime import datetime
import pytz

class RateLimitInfoManager(manager.Manager):
    def get_cut_timediff(self, client):
        return (datetime.now(pytz.timezone('UTC')) - client.last_cut_time).seconds
    def update_cut_time(self, client):
        client.last_cut_time = datetime.now()
        client.save()