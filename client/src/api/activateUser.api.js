import axios from 'axios'
import { BACKEND_URL } from '../main'
import { config } from './baseConfig.api'
/**
 * Llama a la api para activar un usuario
 * @param {Number} id id del usuario a activar
 * @returns {Promise}  la respuesta del servidor
 */
export async function activateUserAPI(id){
    const data =     {
        "user_id" : id
    }
    return await axios.post(BACKEND_URL + `api/create/activateUser/`,data, config)
}