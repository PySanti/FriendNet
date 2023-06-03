from .models import Usuarios
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.generic import (
    FormView,
    View,
    DetailView
)
from django.urls import reverse_lazy
from .forms import (
    UsuariosLoginViewForm,
    UsuariosSignupViewForm
)
# Create your views here.

class LoginView(FormView):
    template_name = 'Usuarios/login_view.html'
    form_class = UsuariosLoginViewForm
    success_url = reverse_lazy('home:home')
    def form_valid(self, form):
        user = form.cleaned_data['user']
        login(self.request,user=user)
        return super().form_valid(form)


class LogoutView(View, LoginRequiredMixin):
    login_url = reverse_lazy('home:home')
    def get(self, request, *args, **kwargs):
        logout(request)
        return  HttpResponseRedirect(
            reverse_lazy('home:home')
        )

class SignUpView(FormView):
    template_name = 'Usuarios/signup_view.html'
    success_url = reverse_lazy('home:home')
    form_class = UsuariosSignupViewForm
    def form_valid(self, form):
        data = form.cleaned_data 
        new_user = Usuarios.objects.create_user(
            data['username'],
            data['password'],
            data['email'],
            first_names = data['first_names'],
            last_names = data['last_names'],
            age = data['age'],
            photo = data['photo'],
        )
        authenticate(username=data['username'], password=data['password'])
        login(self.request, user=new_user)
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
    