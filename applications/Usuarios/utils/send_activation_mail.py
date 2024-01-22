from django.core.mail import send_mail

def activation_mail_html_content(activation_code):
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
                font-weight : 530;
                color : #000;
            }
            button{
                font-size: 12px;
                border: none;
                border-radius: 0px;
                border-bottom-left-radius: 10px;
                border-top-right-radius: 10px;
                height: auto;
                width: auto;
                padding: .4rem;
                outline: 3px solid #4ed31a;
                margin-bottom : 30px;
            }

        </style>
    </head>
    <body>
            <h1 class="title">
                FriendNet
            </h1>
            <button class="content">
                %s
            </button>
    </body>
</html>""" % activation_code;

def send_activation_mail(email, activation_code):
    """
        Funcion creada para estandarizar envio de mensajes usando brevo
    """
    try:
        send_mail(
            subject         =   "Activa tu cuenta", 
            html_message    =  activation_mail_html_content(activation_code),
            message         =   f"Codigo : {activation_code}", 
            from_email      =   "friendnetcorp@gmail.com", 
            recipient_list  =   [email])
    except Exception as e:
        print(e)

