import { config } from './baseConfig.api'
import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'

/**
 *  LLama a api de actualizacion de datos
 * @param {Object} data nuevos datos del usuario  
 * @returns {Promise} la promesa del servidor
 */
export async function updateUserDataAPI(data, accessToken){
    console.log(accessToken)
    config.headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization' : `Bearer ${accessToken}`
    }
    return await axios.put(BACKEND_URL + `api/update_user_data/`,data, config)
}
