import { config } from './baseConfig.api'
import axios from 'axios'
import { BACKEND_URL } from '../main'

export async function updateUserDataAPI(data, userId){
    return await axios.put(BACKEND_URL + `api/update_user_data/${userId}`,data, config)
}
