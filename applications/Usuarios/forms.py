from django.core.exceptions import NON_FIELD_ERRORS
from django.contrib.auth import authenticate
from django import forms
from .models import Usuarios


class UsuariosLoginViewForm(forms.Form):
    username = forms.CharField(label='Usuario')
    password = forms.CharField(label='Contraseña', widget=forms.PasswordInput())

    def clean(self):
        data = super().clean()
        user = authenticate(username=data['username'], password=data['password'])
        if user:
            data['user'] = user
        else:
            raise forms.ValidationError('Usuario o contraseña invalido !')
        return data


class UsuariosSignupViewForm(forms.ModelForm):
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
                'accept' : 'image/png'
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
        data = super().clean()
        if data['password'] != data['password2']:
            self.add_error('password','Las contraseñas no son iguales !')
        return data


class accountActivationForm(forms.Form):
    code = forms.CharField(max_length=6, required=True, label='Codigo', widget=forms.TextInput(attrs={
        'placeholder' : 'Ingresa el código de activación'
    }))
    def __init__(self, pk, *args, **kwargs):
        self.pk = pk
        return super().__init__(*args, **kwargs)
    def clean(self):
        data = super().clean()
        if len(data['code']) != 6:
            self.add_error('code', 'El código debe tener al menos 6 caracteres !')
        else:
            if not Usuarios.objects.checkActivationCode(self.pk, data['code']):
                self.add_error('code', 'El código es invalido !')
            else:
                return data