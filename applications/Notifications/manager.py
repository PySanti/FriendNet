from django.db.models import manager


class NotificationsManager(manager.Manager):
    def addNotification(self, receiver_user, sender_username):
        """
            Agrega una nueva notificacion al field notifications
            del receiver user
        """
        newNotification = self.create(msg=f"{sender_username} te ha enviado un mensaje")
        receiver_user.notifications.add(newNotification)
        receiver_user.save()

