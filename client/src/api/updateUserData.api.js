import { config } from './baseConfig.api'
import axios from 'axios'
import { BACKEND_URL } from '../main'

/**
 *  LLama a api de actualizacion de datos
 * @param {Object} data nuevos datos del usuario  
 * @param {String} userId id de usuario a actualizar  
 * @returns {Promise} la promesa del servidor
 */
export async function updateUserDataAPI(data, userId){
    return await axios.put(BACKEND_URL + `api/update_user_data/${userId}`,data, config)
}
