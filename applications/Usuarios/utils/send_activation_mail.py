from django.core.mail import send_mail

def activation_mail_html_content(message):
    return  """
<html>
    <head>
        <style>
            .title{
                font-size : 30px;
            }
            .header-logo{
                font-size : 30px;
                width : 8em;
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
                <img class="header-logo" src="https://res.cloudinary.com/dwcabo8hs/image/upload/v1707908787/friendnet/lbjmx9aqgziy2otvutfq.png"/>
            </h1>
            <h3 class="content">
                %s
            </h3>
    </body>
</html>""" % ( message);

def send_activation_mail( email, message):
    """
        Funcion creada para estandarizar envio de mensajes usando brevo
    """
    return send_mail(
        subject         =   message, 
        html_message    =  activation_mail_html_content( message),
        message         =   "", 
        from_email      =   "friendnet.inc@gmail.com", 
        recipient_list  =   [email])

