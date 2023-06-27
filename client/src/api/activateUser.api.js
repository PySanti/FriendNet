import axios from 'axios'
import { BACKEND_URL } from '../main'
import { config } from './baseConfig.api'

export async function activateUserAPI(id){
    const data =     {
        "user_id" : id
    }
    return await axios.post(BACKEND_URL + `api/create/activateUser/`,data, config)
}