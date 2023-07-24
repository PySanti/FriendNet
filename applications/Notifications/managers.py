from django.db.models import manager


class NotificationsManager(manager.Manager):
    def hasNotification(self, receiver_user, sender_user):
        """
            Comprueba que receiver_user tenga notificaciones de sender_user
        """
        return True if receiver_user.notifications.filter(sender_user_id=sender_user.id) else False
    def addNotification(self, msg, receiver_user, sender_user):
        """
            Agrega una nueva notificacion al field notifications
            del receiver user
        """
        if (not self.hasNotification(receiver_user, sender_user)):
            newNotification = self.create(msg=msg, sender_user_id=sender_user.id)
            receiver_user.notifications.add(newNotification)
            receiver_user.save()


