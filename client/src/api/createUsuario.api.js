import axios from 'axios'
import { BACKEND_URL } from '../main'
import { config } from './baseConfig.api'

export async function createUsuarioAPI(data){
    return await axios.post(BACKEND_URL+"api/create/",data, config)
}