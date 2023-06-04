from random import randint

def generateActivationCode():
    """
        Funcion creada para llevar a cabo la activacion
        de usuario por correo
    """
    code = ""
    for i in range(6):
        code += str(randint(0,9))
    return code