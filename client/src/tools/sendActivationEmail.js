import emailjs from '@emailjs/browser';
import { generateActivationCode } from './generateActivationCode';


export async function sendActivationEmail(user_email, username){
    const EMAILJS_USER_ID = 'dbpdLVB2QD6gfXbvm';
    const EMAILJS_SERVICE_ID = 'service_e2o1uqc';
    const EMAILJS_TEMPLATE_ID = 'template_nf8e158';
    emailjs.init(EMAILJS_USER_ID);
    return await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        user_email : user_email,
        username : username,
        activation_code : generateActivationCode()
    })
}