from django.core.exceptions import NON_FIELD_ERRORS
from django.contrib.auth import authenticate
from django import forms
from .models import Usuarios


class UsuariosLoginViewForm(forms.Form):
    """
        Formulario para el Login
    """
    username = forms.CharField(label='Usuario')
    password = forms.CharField(label='Contraseña', widget=forms.PasswordInput())

    def clean(self):
        """
            Comprueba que el usuario exista con la contraseña dada, en caso contrario, de error
        """
        data = super().clean()
        user = authenticate(username=data['username'], password=data['password'])
        if user:
            data['user'] = user
        else:
            raise forms.ValidationError('Usuario o contraseña invalido !')
        return data


class UsuariosSignupViewForm(forms.ModelForm):
    """
        Formulario para registro de usuarios
    """
    password2 = forms.CharField(label='Contraseña (de nuevo)', widget=forms.PasswordInput())
    class Meta:
        model = Usuarios
        fields = (
            'first_names',
            'last_names',
            'age',
            'email',
            'photo',
            'username',
            'password',
        )
        labels = {
            'first_names'   : 'Nombres',
            'last_names'    : 'Apellidos',
            'age'           : 'Edad',
            'username'      : 'Usuario',
            'password'      : 'Contraseña',
            'email'         : 'Correo',
            'photo'         : 'Foto',
        }
        widgets = {
            'password' : forms.PasswordInput(),
            'photo' : forms.FileInput(attrs={
                'accept' : 'image/png',
                'class' : 'photo-input'
            })
        }
        error_messages = {
            NON_FIELD_ERRORS : {
                'unique_together' : "Estos datos ya existen en la base de datos !!",
            },
            'username' : {
                'unique' : 'Este usuario ya existe !'
            },
            'email' : {
                'unique' : 'Ya existe un usuario con este correo !'
            }
        }

    def clean(self):
        """
            Unicamente comprueba que las dos contraseñas del formulario sean iguales, en caso contrario da error
        """
        data = super().clean()
        if data['password'] != data['password2']:
            self.add_error('password','Las contraseñas no son iguales !')
        return data


class accountActivationForm(forms.Form):
    """
        Formulario creado para vista de activacion de Usuario
    """
    code = forms.CharField(max_length=6, required=True, label='Codigo', widget=forms.TextInput(attrs={
        'placeholder' : 'Ingresa el código de activación'
    }))
    def __init__(self, pk, *args, **kwargs):
        """
            Se necesita sobreescribir este metodo, ya que se esta enviando desde la vista el pk del usuario
            que se esta activando.
        """
        self.pk = pk
        return super().__init__(*args, **kwargs)
    def clean(self):
        """
            Comprueba que el codigo que se indica en el formulario es igual al asociado al usuario en cuestion
        """
        data = super().clean()
        if len(data['code']) != 6:
            self.add_error('code', 'El código debe tener al menos 6 caracteres !')
        else:
            if not Usuarios.objects.checkActivationCode(self.pk, data['code']):
                self.add_error('code', 'El código es invalido !')
            else:
                return data



class PasswordConfirmationForm(forms.ModelForm):
    """
        Formulario creado para vista de comprobacion de contrasenia de usuario para posterior cambio de contrasenia
    """
    def __init__(self, pk, *args, **kwargs):
        """
            Se sobreescribe este metodo ya que en el mismo se recibe el pk del usuario enviado desde la vista
        """
        self.pk = pk
        return super().__init__(*args, **kwargs)
    class Meta:

        model = Usuarios
        fields = ('password',)
        labels = {
            'password' : 'Contraseña actual'
        }
        widgets = {
            'password' : forms.PasswordInput(attrs={
                'placeholder' : 'Ingresa la contraseña actual'
            })
        }
    def clean(self):
        """
            Comprueba que la contrasenia ingresada corresponde al usuario de la sesion
        """
        data = self.cleaned_data
        user = Usuarios.objects.get(id=self.pk)
        if user.check_password(data['password']):
            return data;
        else:
            raise forms.ValidationError('La contraseña es invalida !')

class DoublePasswordForm(forms.Form):
    """
        Formulario creado para el cambio de contrasenia
    """
    password1 = forms.CharField(required=True,  label='Ingresa la contraseña nueva ', widget=forms.PasswordInput())
    password2 = forms.CharField(required=True,  label='Ingresa la contraseña nueva (nuevamente)', widget=forms.PasswordInput())

    def clean(self):
        """
            Comprueba que ambas contrasenias ingresadas son iguales
        """
        data = self.cleaned_data
        if data['password1'] != data['password2']:
            raise forms.ValidationError('Las contraseñas no son iguales !')
        else:
            return data

class UpdateUserFormClass(forms.ModelForm):
    """
        Formulario creado para actualizacion de datos del usuario
    """
    class Meta:
        model = Usuarios
        fields = ('username', 'email', 'first_names', 'last_names', 'age', 'photo')
        widgets = {
            'photo' : forms.FileInput(attrs={
                'accept' : 'image/png',
                'class' : 'photo-input'
            })
        }