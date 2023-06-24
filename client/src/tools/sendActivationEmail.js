import emailjs from '@emailjs/browser';
import { generateActivationCode } from './generateActivationCode';
import { loadEmailJsData } from './loadEmailjsData';


export async function sendActivationEmail(user_email, username){
    const data                  = await loadEmailJsData("../emailjs.json")
    const activation_code       = generateActivationCode()
    emailjs.init(data['EMAILJS_USER_ID']);
    await emailjs.send(data['EMAILJS_SERVICE_ID'], data['EMAILJS_TEMPLATE_ID'], {
        user_email : user_email,
        username : username,
        activation_code : activation_code
    })
    return activation_code
}