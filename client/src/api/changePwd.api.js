import axios from "axios";
import { BACKEND_URL } from '../utils/constants'
import { config } from "./baseConfig.api";


/**
 * Llama a la api para cambiar old_password por new_password en username
 * @param {Number} user_id
 * @param {String} old_password  
 * @param {String} new_password  
 */
export async function changeUserPwdAPI(user_id, old_password, new_password){
    const data = {
        'user_id' : user_id,
        'old_password' : old_password,
        'new_password' : new_password
    }
    return await axios.post(BACKEND_URL + 'api/change_user_pwd/', data, config)
}
