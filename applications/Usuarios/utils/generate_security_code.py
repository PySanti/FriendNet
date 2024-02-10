from random import randint
def generate_security_code():
    code = []
    for i in range(10):
        if (randint(1,2) == 1):
            code.append(chr(randint(65,90)))
        else:
            code.append(chr(randint(48,57)))
    return "".join(code)
