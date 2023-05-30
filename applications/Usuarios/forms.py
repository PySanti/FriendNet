from django.core.exceptions import NON_FIELD_ERRORS
from django.contrib.auth import authenticate
from django import forms
from .models import Usuarios

UNIQUE_TOGETHER_FIRST_NAMES_ERROR = "Estos datos ya existen en la base de datos !!"

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
            'first_names' : 'Nombres',
            'last_names' :  'Apellidos',
            'age' :         'Edad',
            'username' :    'Usuario',
            'password' :    'Contraseña',
            'email' : 'Correo',
            'photo' : 'Foto',
        }
        widgets = {
            'password' : forms.PasswordInput(),
            'photo' : forms.FileInput(attrs={
                'enctype' : 'multipart/form-data'
            })
        }
        error_messages = {
            NON_FIELD_ERRORS : {
                'unique_together' : UNIQUE_TOGETHER_FIRST_NAMES_ERROR,
            },
            'photo' : {
                'required' : 'Debes cargar una imagen de '
            },
            'username' : {
                'unique' : 'Este usuario ya existe !'
            },
        }

    def clean(self):
        data = super().clean()
        if data['password'] != data['password2']:
            raise forms.ValidationError('Las contraseñas no son iguales !')
        return data