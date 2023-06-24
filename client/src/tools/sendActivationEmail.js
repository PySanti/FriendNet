import emailjs from '@emailjs/browser';
import { generateActivationCode } from './generateActivationCode';
import { loadEmailJsData } from './loadEmailjsData';


export async function sendActivationEmail(user_email, username){
    try{
        const emailjsSettings   =  await loadEmailJsData("../emailjs.json")
        const activation_code   = generateActivationCode()
        emailjs.init(emailjsSettings['EMAILJS_USER_ID']);
        await emailjs.send(emailjsSettings['EMAILJS_SERVICE_ID'], emailjsSettings['EMAILJS_TEMPLATE_ID'], {
            user_email : user_email,
            username : username,
            activation_code : activation_code
        })
        return activation_code
    } catch(error){
        console.log(`Error enviando correo de activacion a ${user_email}`)
    }
}