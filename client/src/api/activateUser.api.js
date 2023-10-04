import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'
import { config } from './baseConfig.api'
/**
 * Llama a la api para activar un usuario
 * @param {Number} id id del usuario a activar
 * @param {String} password
 */
export async function activateUserAPI(id, password){
    const data =     {
        "user_id" : id,
        "password" : password
    }
    return await axios.post(BACKEND_URL + `api/create/activateUser/`,data, config)
}

