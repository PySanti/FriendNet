from django.views.generic import (
    FormView
)
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from .models import Home
from applications.Usuarios.models import Usuarios
from applications.Chats.models import (
    Messages,
    Chat
)
from .forms import MessagesForm
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
        context['users'] = Usuarios.objects.all().exclude(id=self.request.user.id)
        try:
            context['chat_user'] = Usuarios.objects.get(id=self.kwargs['chat_user_id'])
            chat_between = Usuarios.objects.getChatBetween(self.request.user, self.kwargs['chat_user_id'])
            context['messages_hist'] = chat_between.messages.all() if chat_between else None
        except KeyError:
            context['chat_user'] =None 
        return context

    def form_valid(self, form):
        msg = form.cleaned_data['msg']
        new_message = Messages(parent_id=self.request.user.id, content=msg)
        new_message.save()
        chat_between = Usuarios.objects.getChatBetween(self.request.user, self.kwargs['chat_user_id'])
        if chat_between:
            chat_between2 = Usuarios.objects.getChatBetween(Usuarios.objects.get(id=self.kwargs['chat_user_id']), self.request.user.id)
            chat_between.messages.add(new_message)
            chat_between2.messages.add(new_message)
            chat_between.save()
            chat_between2.save()
        else:
            new_chat1 = Chat(user_id=self.kwargs['chat_user_id'])
            new_chat2 = Chat(user_id=self.request.user.id)
            new_chat1.save()
            new_chat2.save()
            new_chat1.messages.add(new_message)
            new_chat2.messages.add(new_message)
            new_chat1.save()
            new_chat2.save()
            self.request.user.chats.add(new_chat1)
            Usuarios.objects.get(id=self.kwargs['chat_user_id']).chats.add(new_chat2)

        return HttpResponseRedirect(
            reverse_lazy('home:home', kwargs={'chat_user_id':self.kwargs['chat_user_id']})
        )