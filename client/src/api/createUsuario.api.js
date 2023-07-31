import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'
import { config } from './baseConfig.api'

/**
 * Llama a la api para crear usuario en servidor
 * @param {Object} data datos del usuario a registrar  
 * @returns {Promise} la promesa del servidor
 */
export async function createUsuarioAPI(data){
    config.headers = {'Content-Type': 'multipart/form-data'}
    return await axios.post(BACKEND_URL+"api/create/",data, config)
}