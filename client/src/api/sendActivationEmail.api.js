import emailjs from '@emailjs/browser';
import {  loadFile } from '../tools/loadFile';


/**
 * Carga datos del archivo emailjs.json y envia correo con activation_code al usuario username 
 * @param {String} user_email  
 * @param {String} username  
 * @param {String} activation_code  
 * @returns {Promise} la promesa del servidor
 */
export async function sendActivationEmailAPI(user_email, username, activation_code){
    const emailjsSettings   =  await loadFile("../../emailjs.json")
    emailjs.init(emailjsSettings['EMAILJS_USER_ID']);
    const data = {
        user_email : user_email,
        username : username,
        activation_code : activation_code
    }
    return await emailjs.send(emailjsSettings['EMAILJS_SERVICE_ID'], emailjsSettings['EMAILJS_TEMPLATE_ID'], data)
}