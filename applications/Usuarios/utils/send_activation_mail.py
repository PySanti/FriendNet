from django.core.mail import send_mail

def activation_mail_html_content(message, code):
    return  """
<html>
    <head>
        <style>
            *{
                text-align : center;
                font-family : sans-serif;
                color : #000;
            }
            body{
                display : flex;
                justify-content : center;
                flex-direction : column;
            }
            .code{
                font-weight : 400;
            }
        </style>
    </head>
    <body>
        <h3 class="title">
            %s
        </h3>
        <h3 class="code">
            %s
        </h3>
    </body>
</html>""" % ( message, code);

def send_activation_mail( email, message, code):
    """
        Funcion creada para estandarizar envio de mensajes usando brevo
    """
    return send_mail(
        subject         =   message, 
        html_message    =  activation_mail_html_content(message, code),
        message         =   "", 
        from_email      =   "friendnet.inc@gmail.com", 
        recipient_list  =   [email])

