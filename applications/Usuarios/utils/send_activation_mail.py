
from __future__ import print_function
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = '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'
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