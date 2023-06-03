from .models import Usuarios
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from .tools import generateActivationCode
from django.core.mail import send_mail
from django.conf import settings
from django.views.generic import (
    FormView,
    View,
    DetailView
)
from django.urls import reverse_lazy
from .forms import (
    UsuariosLoginViewForm,
    UsuariosSignupViewForm,
    accountActivationForm
)
# Create your views here.

class LoginView(FormView):
    template_name = 'Usuarios/login_view.html'
    form_class = UsuariosLoginViewForm
    success_url = reverse_lazy('home:home')
    def form_valid(self, form):
        user = form.cleaned_data['user']
        login(self.request,user=user)
        Usuarios.objects.connectUser(user.id)
        return super().form_valid(form)


class LogoutView(View, LoginRequiredMixin):
    login_url = reverse_lazy('home:home')
    def get(self, request, *args, **kwargs):
        Usuarios.objects.disconnectUser(kwargs['pk'])
        logout(request)
        return  HttpResponseRedirect(
            reverse_lazy('home:home')
        )

class SignUpView(FormView):
    template_name = 'Usuarios/signup_view.html'
    form_class = UsuariosSignupViewForm
    def form_valid(self, form):
        data = form.cleaned_data 
        code = generateActivationCode()
        new_user = Usuarios.objects.create_user(
            data['username'],
            data['password'],
            data['email'],
            first_names = data['first_names'],
            last_names = data['last_names'],
            age = data['age'],
            photo = data['photo'],
            activation_code = code ,
        )
        send_mail(
            "FRIENDNET",
            f"""
            Ingresa este codigo para activar tu usuario, {new_user.username}

            {code}
            """,
            settings.SECRETS['EMAIL_USER'],
            [new_user.email]
        )
        return HttpResponseRedirect(
            reverse_lazy('users:activation',  kwargs={'pk':new_user.id})
        )

class AccountActivationView(FormView):
    template_name = 'Usuarios/account_activation_view.html'
    form_class = accountActivationForm
    success_url = reverse_lazy('home:home')
    def get_form_kwargs(self):
        kwargs = super(AccountActivationView, self).get_form_kwargs()
        kwargs['pk'] = self.kwargs['pk']
        return kwargs
    def form_valid(self, form):
        Usuarios.objects.activeUser(self.kwargs['pk'], self.request)
        print('Usuario activado!')
        return super().form_valid(form)

class ShowUserDetailView(DetailView):
    template_name = 'Usuarios/usuarios_detail.html'
    model = Usuarios
    context_object_name = 'usuario'
    USERS_TRADUCTION_ATTRS = {
        'username' : 'Usuario',
        'email' : 'Correo',
        'first_names' : 'Nombres',
        'last_names' : 'Apellidos',
        'age' : 'Edad',
    }
    NOT_TEMPLATEABLE_ATTRS = ['id', 'password', 'last_login', 'is_superuser', 'is_staff', 'is_online', 'current_status', '_state', 'photo', 'is_active', 'activation_code']
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        cleaned_usuario_dict = {
            self.USERS_TRADUCTION_ATTRS[i[0]]:i[1] for i in context['usuario'].__dict__.items() if i[0] not in self.NOT_TEMPLATEABLE_ATTRS
        }
        context['user_data'] = cleaned_usuario_dict
        context['user_photo'] = context['usuario'].photo.url
        return context
    