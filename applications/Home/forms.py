from django import forms

class MessagesForm(forms.Form):
    msg = forms.CharField(required=False, max_length=50, widget=forms.TextInput(attrs={
        'placeholder' : 'Ingresa el mensaje'
    }))

class StatusForm(forms.Form):
    status = forms.CharField(label='Cambia tu status',max_length=10, widget=forms.TextInput(attrs={
        'placeholder' : 'Como te sientes?'
    }), required=False)

    def clean(self):
        if self.cleaned_data['status'] == '':
            raise forms.ValidationError('El estado no puede estar vacio')
        return self.cleaned_data


