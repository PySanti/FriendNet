from typing import Any, Dict
from .models import Usuarios
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse_lazy
from .tools import generateActivationCode
from django.core.mail import send_mail
from django.conf import settings
from django.views.generic import (
    FormView,
    View,
    UpdateView
)
from django.urls import reverse_lazy
from .forms import (
    UsuariosLoginViewForm,
    UsuariosSignupViewForm,
    accountActivationForm,
    PasswordConfirmationForm,
    DoublePasswordForm,
    UpdateUserFormClass
)
# Create your views here.

class LoginView(FormView):
    """
        Vista creada para logear al usuario y conectarlo 
    """
    template_name = 'Usuarios/login_view.html'
    form_class = UsuariosLoginViewForm
    success_url = reverse_lazy('home:home')

    def form_valid(self, form):
        user = form.cleaned_data['user']
        login(self.request,user=user)
        Usuarios.objects.connectUser(user.id)
        return super().form_valid(form)

class LogoutView(View, LoginRequiredMixin):
    """
        Vista creada para deslogear al usuario y desconectarlo 
    """
    login_url = reverse_lazy('home:home')
    def get(self, request, *args, **kwargs):
        Usuarios.objects.disconnectUser(kwargs['pk'])
        logout(request)
        return  HttpResponseRedirect(
            reverse_lazy('home:home')
        )

class SignUpView(FormView):
    """
        Vista creada para la creacion del usuario
    """
    template_name = 'Usuarios/signup_view.html'
    form_class = UsuariosSignupViewForm
    def form_valid(self, form):
        """
            En caso de que los datos ingresados en el formulario sean validos,
            crea al usuario, envia el codigo de activacion al correo del usuario,
            y redirije a la vista para activacion
        """
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
    """
        Vista creada para activar al usuario por el codigo enviado
        a su correo
    """
    template_name = 'Usuarios/account_activation_view.html'
    form_class = accountActivationForm
    success_url = reverse_lazy('home:home')
    def get_form_kwargs(self):
        """
            Envia el pk del usuario que se esta evaluando al formulario
            para poder comprobar que el codigo ingresado es valido
            desde el mismo formulario
        """
        kwargs = super(AccountActivationView, self).get_form_kwargs()
        kwargs['pk'] = self.kwargs['pk']
        return kwargs
    def form_valid(self, form):
        """
            En caso de que el codigo ingresado sea correcto, se activa
            al usuario
        """
        Usuarios.objects.activeUser(self.kwargs['pk'], self.request)
        return super().form_valid(form)

class ShowUserDetailView(UpdateView):
    """
        Vista creada para llevar a cabo la actualizacion y detalle
        del usuario
    """
    template_name = 'Usuarios/usuarios_detail.html'
    form_class = UpdateUserFormClass
    model = Usuarios
    USERS_TRADUCTION_ATTRS = {
        'username' : 'Usuario',
        'email' : 'Correo',
        'first_names' : 'Nombres',
        'last_names' : 'Apellidos',
        'age' : 'Edad',
    }
    NOT_TEMPLATEABLE_ATTRS = ['id', 'password', 'last_login', 'is_superuser', 'is_staff', 'is_online', 'current_status', '_state', 'photo', 'is_active', 'activation_code']
    def get_context_data(self, **kwargs):
        """
            Agregar las siguientes variables al contexto del template
            
            ~ usuario
            ~ datos del usuario iterables (en diccionario)
            ~ ruta de foto del usuario
        """
        context = super().get_context_data(**kwargs)
        context['usuario'] = Usuarios.objects.get(id=self.kwargs['pk'])
        cleaned_usuario_dict = {
            self.USERS_TRADUCTION_ATTRS[i[0]]:i[1] for i in context['usuario'].__dict__.items() if i[0] not in self.NOT_TEMPLATEABLE_ATTRS
        }
        context['user_data'] = cleaned_usuario_dict
        if not context['usuario'].photo:
            context['user_photo'] = ""
        else:
            context['user_photo'] = context['usuario'].photo.url
        return context
    
    def form_valid(self, form):
        """
            En caso de que el usuario active el formulario
            y envíe datos a traves de el, se actualizan
            los datos del usuario
        """
        user = Usuarios.objects.get(id=self.kwargs['pk'])
        data = form.cleaned_data
        if Usuarios.objects.dataIsDiferent(user, data):
            user.username = data['username']
            user.email = data['email']
            user.first_names = data['first_names']
            user.last_names = data['last_names']
            user.age = data['age']
            user.photo = data['photo']
            user.save()
        return HttpResponseRedirect(
            reverse_lazy('users:detail', kwargs={'pk': self.kwargs['pk'] })
        )

class PasswordConfirmationView(FormView):
    """
        Vista creada para comprobar que el usuario
        concurrente es el dueño del usuario de la 
        session. Vista previa a cambio de contraseña
    """
    template_name = 'Usuarios/pwd_confirmation_view.html'
    form_class = PasswordConfirmationForm
    def get_form_kwargs(self):
        """
            Envía la pk del usuario que se esta evaluando a
            la vista para cambio de contraseña. Esto para poder
            comprobar la validez de los datos desde el mismo
            form
        """
        kwargs = super().get_form_kwargs()
        kwargs['pk'] = self.kwargs['pk']
        return kwargs
    def form_valid(self, form):
        """
            En caso de que el dueño de la cuenta
            sea el mismo que el usuario controlando la sesión,
            se redirige a vista para cambio de contraseña
        """
        return HttpResponseRedirect(
            reverse_lazy('users:pwd-change', kwargs={'pk' : self.kwargs['pk']})
        )

class ChangePasswordView(FormView):
    """
        Vista creada para cambio de contraseña
    """
    template_name = 'Usuarios/change_password_view.html'
    form_class = DoublePasswordForm
    def form_valid(self, form):
        user = Usuarios.objects.get(id=self.kwargs['pk'])
        user.set_password(form.cleaned_data['password1'])
        user.save()
        return HttpResponseRedirect(
            reverse_lazy('users:detail', kwargs={'pk':self.kwargs['pk']})
        )