import { config } from './baseConfig.api'
import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'


export async function userIsOnlineAPI(userId, accessToken){
    config.headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization' : `Bearer ${accessToken}`
    }
    const data = {
        "target_user_id" : userId
    }
    return await axios.post(BACKEND_URL + `api/user_is_online/`,data, config)
}


