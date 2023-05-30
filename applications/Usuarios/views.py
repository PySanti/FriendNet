from .models import Usuarios
from django.contrib.auth import login, logout, authenticate
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.generic import (
    FormView,
    View
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


class LogoutView(View):
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
        login(new_user)
        return super().form_valid(form)

