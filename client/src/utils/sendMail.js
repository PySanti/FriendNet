import {sendActivationEmailAPI} from "../api/sendActivationEmail.api"
/**
 * Funcion pivote creada para llamar a api de envio de mails
 */
export async function sendMail(activationCode, userEmail, username){
    await sendActivationEmailAPI(userEmail, username, activationCode)
}