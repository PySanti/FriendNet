from django.core.mail import send_mail
from django.conf import settings
from applications.Usuarios.utils.mail_html_content import mail_html_content

def send_activation_mail( email, message, code):
    """
        Funcion creada para estandarizar envio de mensajes usando brevo
    """
    return send_mail(
        subject         =   message, 
        html_message    =  mail_html_content(message, code),
        message         =   "", 
        from_email      =   settings["EMAIL_HOST_USER"], 
        recipient_list  =   [email])

