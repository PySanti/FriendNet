import emailjs from '@emailjs/browser';
import { loadEmailJsData } from '../tools/loadEmailjsData';


export async function sendActivationEmailAPI(user_email, username, activation_code){
    try{
        const emailjsSettings   =  await loadEmailJsData("../../emailjs.json")
        emailjs.init(emailjsSettings['EMAILJS_USER_ID']);
        await emailjs.send(emailjsSettings['EMAILJS_SERVICE_ID'], emailjsSettings['EMAILJS_TEMPLATE_ID'], {
            user_email : user_email,
            username : username,
            activation_code : activation_code
        })
    } catch(error){
        console.log(`Error enviando correo de activacion a ${user_email}`)
        console.log(error)
    }
}