from django.db.models import manager
import datetime
import pytz

class RateLimitInfoManager(manager.Manager):
    def get_cut_timediff(self, client):
        return (datetime.datetime.now(pytz.timezone("UTC")) - client.last_cut_time).seconds
    def update_cut(self, client):
        client.last_cut_time = datetime.datetime.now()
        client.calls_in_cut = 0
        client.save()
    def suspend_client(self, client):
        client.strikes += 1
        if client.strikes > 2:
            client.banned = True
        else:
            client.suspended_time = datetime.date.today() + datetime.timedelta(days=7)
        client.save()
    def client_is_suspended(self, client):
        if client.suspended_time:
            suspended_time_diff = (client.suspended_time - datetime.datetime.now(pytz.timezone("UTC"))).days 
            if (suspended_time_diff < 0):
                client.suspended_time = None
                client.save()
                return False
            else:
                return True
        else:
            return False
    def update_calls_in_cut(self, client):
        client.calls_in_cut+=1
        client.save()


