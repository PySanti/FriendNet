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
    Messages,
    Chat
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
        try:
            context['chat_user'] = Usuarios.objects.get(id=self.kwargs['chat_user_id'])
            chat_between = Chat.objects.chatBetween(self.request.user.id, self.kwargs['chat_user_id'])
            context['messages_hist'] = chat_between.messages.all() if chat_between else None
        except KeyError:
            context['chat_user'] =None 
        return context

    def form_valid(self, form):
        msg = form.cleaned_data['msg']
        if msg != '':
            new_message = Messages(parent_id=self.request.user.id, content=msg)
            new_message.save()
            chat_between = Chat.objects.chatBetween(self.request.user.id, self.kwargs['chat_user_id'])
            if chat_between:
                chat_between.messages.add(new_message)
                chat_between.save()
            else:
                new_chat = Chat(users_id=f"{self.request.user.id},{self.kwargs['chat_user_id']}")
                new_chat.save()
                new_chat.messages.add(new_message)
                new_chat.save()
            
            receiver_user = Usuarios.objects.get(id=self.kwargs['chat_user_id'])
            newNotification = Notifications(msg=f"{self.request.user.username} te ha enviado un mensaje")
            newNotification.save()
            receiver_user.notifications.add(newNotification)
            receiver_user.save()

        return HttpResponseRedirect(
            reverse_lazy('home:home', kwargs={'chat_user_id':self.kwargs['chat_user_id']})
        )
    def post(self, request, *args, **kwargs):
        if 'status' in request.POST:
            status_form = StatusForm(request.POST)
            if status_form.is_valid():
                print(f'cambiando estado a {request.POST["status"]}')
                request.user.current_status = request.POST['status']
                request.user.save()
        return super().post(request, *args, **kwargs)
