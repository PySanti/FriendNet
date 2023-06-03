from random import randint

def generateActivationCode():
    code = ""
    for i in range(6):
        code += str(randint(0,9))
    return code