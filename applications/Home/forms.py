from django import forms

class MessagesForm(forms.Form):
    msg = forms.CharField(max_length=50, required=True, widget=forms.TextInput(attrs={
        'placeholder' : 'Ingresa el mensaje'
    }))
