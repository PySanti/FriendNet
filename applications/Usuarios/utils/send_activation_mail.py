
from __future__ import print_function
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
import json
from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

with open(BASE_DIR / "../../secrets.json", 'r') as f:
    BREVO_KEY = json.load(f)["BREVO_KEY"]

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = BREVO_KEY
api_instance    = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

subject         = "from the Python SDK!"
sender          = {"name":"PySanti","email":"friendnetcorp@gmail.com"}
replyTo         = {"name":"Sendinblue","email":"contact@sendinblue.com"}
html_content    = "<html><body><h1>This is my first transactional email </h1></body></html>"
to              = [{"email":"example@example.com","name":"Jane Doe"}]
params          = {"parameter":"My param value","subject":"New Subject"}

def send_activation_mail(email, activation_code):
    """
        Funcion creada para estandarizar envio de mensajes usando brevo
    """
    try:
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=email,
            html_content=html_content, 
            sender=sender, 
            subject=subject)
        api_response = api_instance.send_transac_email(send_smtp_email)
        print(api_response)
    except ApiException as e:
        print("Exception when calling SMTPApi->send_transac_email: %s\n" % e)