from django.core.mail import send_mail

def send_activation_mail(email, activation_code):
    """
        Funcion creada para estandarizar envio de mensajes usando brevo
    """
    send_mail(
        subject         =   "Activa tu cuenta", 
        message         =   f"Codigo : {activation_code}", 
        from_email      =   "friendnetcorp@gmail.com", 
        recipient_list  =   [email])
