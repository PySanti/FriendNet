import emailjs from '@emailjs/browser';
import { loadEmailJsData } from '../tools/loadEmailjsData';


export async function sendActivationEmailAPI(user_email, username, activation_code){
    const emailjsSettings   =  await loadEmailJsData("../../emailjs.json")
    emailjs.init(emailjsSettings['EMAILJS_USER_ID']);
    const data = {
        user_email : user_email,
        username : username,
        activation_code : activation_code
    }
    return await emailjs.send(emailjsSettings['EMAILJS_SERVICE_ID'], emailjsSettings['EMAILJS_TEMPLATE_ID'], data)
}