import { config } from './baseConfig.api'
import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'


export async function generateSendSecurityCodeAPI(userEmail, message){
    const data = {
        'user_email' : userEmail,
        'message' : message
    }
    return await axios.post(BACKEND_URL + `api/security_code_sending/`,data, config)
}



