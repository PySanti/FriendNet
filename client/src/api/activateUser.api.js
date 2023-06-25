import axios from 'axios'
import { BACKEND_URL } from '../main'

export async function activateUserAPI(id){
    const response = await axios.post(BACKEND_URL + `api/create/activateUser/`,
    {
        "user_id" : id
    })
    return response
}