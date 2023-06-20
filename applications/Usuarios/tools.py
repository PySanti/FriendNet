from random import randint
from django.core.mail import send_mail
from django.conf import settings

def generateActivationCode():
    """
        Funcion creada para llevar a cabo la activacion
        de usuario por correo
    """
    code = ""
    for i in range(6):
        code += str(randint(0,9))
    return code

def getFormatedDateDiff(new_date, old_date):
    diff =  new_date- old_date
    days, seconds = divmod(diff.total_seconds(), 86400)
    hours, seconds = divmod(seconds, 3600)
    minutes, seconds = divmod(seconds, 60)


    # Format the result as a string
    if days:
        diff_string = f"{round(days)} dias"
    elif hours:
        diff_string = f"{round(hours)} horas"
    elif minutes:
        diff_string = f"{round(minutes)} minutos"
    elif seconds:
        diff_string = f"{round(seconds)} segundos"
    return diff_string

def sendActivationCodeEmail(username, email):
    """
        Automatiza el proceso de envio de email
        a usuario {username} y retorna el codigo
        de activacion en cuestion
    """
    code = generateActivationCode()
    send_mail(
        "FRIENDNET",
        f"""
        Ingresa este codigo para activar tu usuario, {username}
        {code}
        """,
        settings.SECRETS['EMAIL_USER'],
        [email]
    )
    return code