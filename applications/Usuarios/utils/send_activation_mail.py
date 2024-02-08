from django.core.mail import send_mail

def activation_mail_html_content(username, activation_code):
    return  """
<html>
    <head>
        <style>
            .title{
                font-size : 30px;
            }
            *{
                text-align : center;
                font-family : sans-serif;
                color : #000;
            }
        </style>
    </head>
    <body>
            <h1 class="title">
                FriendNet, %s 
            </h1>
            <h3 class="content">
                Activa tu cuenta - %s
            </h3>
    </body>
</html>""" % (username , activation_code);

def send_activation_mail(username, email, activation_code):
    """
        Funcion creada para estandarizar envio de mensajes usando brevo
    """
    try:
        send_mail(
            subject         =   "Activa tu cuenta", 
            html_message    =  activation_mail_html_content(username,activation_code),
            message         =   f"Codigo : {activation_code}", 
            from_email      =   "friendnetcorp@gmail.com", 
            recipient_list  =   [email])
    except Exception as e:
        print(e)

