from django.views.generic import (
    FormView
)
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from applications.Usuarios.models import Usuarios
from applications.Notifications.models import (
    Notifications
)
from applications.Chats.models import (
    Chat,
    Messages
)
from .forms import (
    MessagesForm,
)
# Create your views here.
class HomeView(FormView):
    """
        Vista creada para el home del proyecto
    """
    template_name = 'Home/home_view.html'
    form_class = MessagesForm
    def dispatch(self, request, *args, **kwargs):
        if 'chat_user_id' in self.kwargs:
            Notifications.objects.deleteUserChatNotificactions(user=self.request.user,chat_user_id=self.kwargs['chat_user_id'])
        return super().dispatch(request, *args, **kwargs)
    def get_context_data(self, **kwargs):
        """
            Envia la informacion del Home extraida de la DB al template del Home
        """
        context = super().get_context_data(**kwargs)
        context['home_data'] = Home.objects.get(id=1)
        if self.request.user.is_authenticated:
            context['users'] = Usuarios.objects.all().exclude(id=self.request.user.id)
            context['user_notifications'] = Usuarios.objects.getParsedNotifications(self.request.user)
        if 'chat_user_id' in self.kwargs:
            context['chat_user'] = Usuarios.objects.get(id=self.kwargs['chat_user_id'])
            context['messages_hist'] = Chat.objects.getMessagesHistorial(
                session_user_id=self.request.user.id,
                chat_user_id=self.kwargs['chat_user_id']
            )
        else:
            context['chat_user'] =None 
        return context
    def form_valid(self, form):
        msg = form.cleaned_data['msg']
        if msg:
            receiver_user = Usuarios.objects.get(id=self.kwargs['chat_user_id']) 
            Chat.objects.sendMessage(
                sender_user     = self.request.user, 
                receiver_user   = receiver_user, 
                new_message     = Messages.objects.CreateMessage(
                    parent_id   =  self.request.user.id,
                    msg         = msg
                )
            )
            Notifications.objects.addNotification(
                receiver_user   = receiver_user,
                msg             = f"{self.request.user.username} te ha enviado un mensaje",
                code            =  str(self.request.user.id)
            )
        if 'chat_user_id' in self.kwargs:
            return HttpResponseRedirect(
                reverse_lazy('home:home', kwargs={'chat_user_id':self.kwargs['chat_user_id']} )
            )
        else:
            return HttpResponseRedirect(
                reverse_lazy('home:home' )
            )