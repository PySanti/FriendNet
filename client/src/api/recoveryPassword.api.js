import axios from "axios";
import { BACKEND_URL } from '../utils/constants'
import { config } from "./baseConfig.api";


export async function recoveryPasswordAPI(email, newPassword){
    const data = {
        'email' : email,
        'new_password' : newPassword
    }
    return await axios.post(BACKEND_URL + 'api/recovery_password/', data, config)
}