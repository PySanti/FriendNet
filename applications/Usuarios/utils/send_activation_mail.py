from django.core.mail import send_mail

def activation_mail_html_content(username, message):
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
                %s
            </h3>
    </body>
</html>""" % (username , message);

def send_activation_mail(username, email, message):
    """
        Funcion creada para estandarizar envio de mensajes usando brevo
    """
    return send_mail(
        subject         =   message, 
        html_message    =  activation_mail_html_content(username, message),
        message         =   "", 
        from_email      =   "friendnet.inc@gmail.com", 
        recipient_list  =   [email])

