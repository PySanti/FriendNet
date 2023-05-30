from django.contrib.auth import authenticate
from django import forms

class UsuariosLoginViewForm(forms.Form):
    username = forms.CharField(label='usuario')
    password = forms.CharField(label='contraseña', widget=forms.PasswordInput())

    def clean(self):
        data = super().clean()
        user = authenticate(username=data['username'], password=data['password'])
        if user:
            data['user'] = user
        else:
            raise forms.ValidationError('Usuario o contraseña invalido !')
        return data
