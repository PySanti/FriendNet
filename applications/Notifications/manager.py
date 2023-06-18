from django.db.models import manager


class NotificationsManager(manager.Manager):
    def addNotification(self, msg, receiver_user, code):
        """
            Agrega una nueva notificacion al field notifications
            del receiver user
        """
        newNotification = self.create(msg=msg, code=code)
        receiver_user.notifications.add(newNotification)
        receiver_user.save()

