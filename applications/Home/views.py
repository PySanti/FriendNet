from django.views.generic import (
    FormView
)
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from .models import Home
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
    StatusForm
)
# Create your views here.
class HomeView(FormView):
    """
        Vista creada para el home del proyecto
    """
    template_name = 'Home/home_view.html'
    form_class = MessagesForm
    def get_context_data(self, **kwargs):
        """
            Envia la informacion del Home extraida de la DB al template del Home
        """
        context = super().get_context_data(**kwargs)
        context['home_data'] = Home.objects.get(id=1)
        if self.request.user.is_authenticated:
            context['status_form'] = StatusForm()
            context['users'] = Usuarios.objects.all().exclude(id=self.request.user.id)
            context['user_notifications'] = Usuarios.objects.getParsedNotifications(self.request.user)
        if 'chat_user_id' in self.kwargs:
            context['chat_user'] = Usuarios.objects.get(id=self.kwargs['chat_user_id'])
            chat_between = Chat.objects.chatBetween(self.request.user.id, self.kwargs['chat_user_id'])
            context['messages_hist'] = chat_between.messages.all() if chat_between else None
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
                sender_username = self.request.user.username
            )
        if 'chat_user_id' in self.kwargs:
            return HttpResponseRedirect(
                reverse_lazy('home:home', kwargs={'chat_user_id':self.kwargs['chat_user_id']} )
            )
        else:
            return HttpResponseRedirect(
                reverse_lazy('home:home' )
            )

    def post(self, request, *args, **kwargs):
        if 'status' in request.POST:
            status_form = StatusForm(request.POST)
            if status_form.is_valid():
                Usuarios.objects.setState(request.user, request.POST['status'])
        return super().post(request, *args, **kwargs)