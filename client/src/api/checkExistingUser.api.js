import axios from 'axios'
import { BACKEND_URL } from '../main'
import { config } from './baseConfig.api'


export async function checkExistingUserAPI(username, email){
    const data =     {
        'username': username,
        'email' : email
    }
    return await axios.post(BACKEND_URL + `api/create/check_existing_user/`,data, config)
}