from django.db.models import manager


class NotificationsManager(manager.Manager):
    def addNotification(self, msg, receiver_user, sender_user):
        """
            Agrega una nueva notificacion al field notifications
            del receiver user
        """
        newNotification = self.create(msg=msg, sender_user_id=sender_user.id)
        receiver_user.notifications.add(newNotification)
        receiver_user.save()
    def _deleteNotifications(self, notifications):
        if notifications:
            notifications.delete()


