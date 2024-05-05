from django.db.models import manager
from ..Chats.utils.create_message_prev import create_message_prev


class NotificationsManager(manager.Manager):
    def has_notification(self, receiver_user, sender_user):
        """
            Comprueba que receiver_user tenga notificaciones de sender_user
        """
        return True if receiver_user.notifications.filter(sender_user_id=sender_user.id) else False
    def add_notification(self, notification_msg, receiver_user, sender_user):
        """
            Agrega una nueva notificacion al field notifications
            del receiver user
        """
        message_prev = create_message_prev(notification_msg)
        newNotification = self.create(msg=f"{sender_user.username} : {message_prev}", sender_user_id=sender_user.id)
        receiver_user.notifications.add(newNotification)
        receiver_user.save()
        return newNotification    
    def delete_notification(self, notificationId):
        """
            Recibe el id de una notificacion y la elimina
        """
        notification = self.get(id=notificationId)
        notification.delete()


