from django.contrib.auth import login, logout
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.generic import (
    FormView,
    View
)
from django.urls import reverse_lazy
from .forms import UsuariosLoginViewForm
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
