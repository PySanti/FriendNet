from django import forms

class MessagesForm(forms.Form):
    msg = forms.CharField(label="",required=False, max_length=50, widget=forms.TextInput(attrs={
        'placeholder' : 'Ingresa un mensaje',
        'class' : 'django-msg-input'
    }))



