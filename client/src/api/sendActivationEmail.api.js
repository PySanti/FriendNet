import {  loadFile } from '../utils/loadFile';


/**
 * Carga datos del archivo smtpjs.json y envia correo con activation_code al usuario username 
 * @param {String} user_email  
 * @param {String} username  
 * @param {String} activation_code  
 * @returns {Promise} la promesa del servidor
 */
export async function sendActivationEmailAPI(user_email, username, activation_code){
    const smtpjsConfig = await loadFile("../../smtpjs.json")
    window.Email.send({
        Host : smtpjsConfig['USERNAME'],
        Username : smtpjsConfig['USERNAME'],
        Password : smtpjsConfig['PASSWORD'],
        To : user_email,
        From : smtpjsConfig['USERNAME'],
        Subject : "This is the subject",
        Body : "And this is the body"
    }
    )
}