import axios from 'axios'
import { BACKEND_URL } from '../main'

export function createUsuarioAPI(data){
    return axios.post(BACKEND_URL+"api/create",data)
}