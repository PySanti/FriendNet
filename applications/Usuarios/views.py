from rest_framework.viewsets import ModelViewSet
from rest_framework.views import (
    APIView
)
from rest_framework.response import Response
from django.contrib.auth import (
    authenticate
)


from .serializers import UsuariosModelSerializer
from .models import Usuarios
from django.contrib.auth import login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import  HttpResponseRedirect
from django.urls import reverse_lazy
from .tools import (
    sendActivationCodeEmail
)

# crud api
class UsuariosModelViewSet(ModelViewSet):
    queryset = Usuarios.objects.all()
    serializer_class = UsuariosModelSerializer


# login api
class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'message': 'Login successful.'})
        else:
            return Response({'message': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)










from applications.Notifications.models import Notifications
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

from applications.Notifications.models import Notifications
# Create your views here.

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
class UnactiveUserLogin(AccountActivationView):
    template_name = 'Usuarios/unactive_user_login_view.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = Usuarios.objects.get(id=self.kwargs['pk'])
        context['user_email'] = user.email
        return context

class LoginView(FormView):
    """
        Vista creada para logear al usuario y conectarlo 
    """
    template_name = 'Usuarios/login_view.html'
    form_class = UsuariosLoginViewForm
    success_url = reverse_lazy('home:home')

    def form_valid(self, form):
        if 'failed_activation_user' in form.cleaned_data:
            Usuarios.objects.updateActivationCode(form.cleaned_data['user'])
            return HttpResponseRedirect(
                reverse_lazy('users:unactive_login', kwargs={'pk':form.cleaned_data['user'].id} )
            )
        else:
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
        code = sendActivationCodeEmail(data['username'], data['email'])
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
        return HttpResponseRedirect(
            reverse_lazy('users:activation',  kwargs={'pk':new_user.id})
        )

class ShowUserDetailView(UpdateView):
    """
        Vista creada para llevar a cabo la actualizacion y detalle
        del usuario
    """
    template_name = 'Usuarios/usuarios_detail.html'
    form_class = UpdateUserFormClass
    model = Usuarios

    def dispatch(self, request, *args, **kwargs):
        """
            Este metodo se ejecutara justo cuando la vista sea llamada.
            Este deberia de eliminar todas las notificaciones de 
            actualizacion del usuario
        """
        if self.request.user.is_authenticated:
            Notifications.objects.deleteUserUpdateNofications(user=self.request.user)
        return super().dispatch(request, *args, **kwargs)
    def get_context_data(self, **kwargs):
        """
            Agregar las siguientes variables al contexto del template
            
            ~ usuario
            ~ datos del usuario iterables (en diccionario)
            ~ ruta de foto del usuario
        """
        context = super().get_context_data(**kwargs)
        context['usuario'] = Usuarios.objects.get(id=self.kwargs['pk'])
        context['user_data'] = Usuarios.objects.getCleanedUserData(context['usuario'])
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
            Usuarios.objects.updateUserWithData(
                user=user,
                data=data
            )
            Notifications.objects.addNotification(
                receiver_user=user,
                msg = "Has hecho modificaciones en tu perfil !",
                code = 'u'
            )
        else:
            print('No hubieron cambios')
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
        Usuarios.objects.changePassword(
            user=self.request.user,
            new_password=form.cleaned_data['password1']
        )
        Notifications.objects.addNotification(
            msg = "Has cambiado tu contraseña",
            receiver_user=self.request.user,
            code = 'u'
        )
        return HttpResponseRedirect(
            reverse_lazy('users:detail', kwargs={'pk':self.kwargs['pk']})
        )