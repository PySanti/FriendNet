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
    def _deleteNotifications(self, notifications):
        if notifications:
            notifications.delete()
    def deleteUserUpdateNofications(self, user):
        """
            Elimina todas las notificaciones de actualizacion de
            perfil del usuario. Este metodo deberia de ejecutarse
            cuando se entra a la detailView y hay notificaciones
            con codigo 'u' almacenadas
        """
        notifications=user.notifications.filter(code='u')
        self._deleteNotifications(notifications)
    def deleteUserChatNotificactions(self, user, chat_user_id):
        notifications = user.notifications.filter(code=chat_user_id)
        self._deleteNotifications(notifications)


