import axios from 'axios'
import { BACKEND_URL } from '../main'

export async function createUsuarioAPI(data){
    try {
        const response = await axios.post(BACKEND_URL+"api/create/",data)
        return response
    } catch(error){
        console.log('Error al crear usuario ')
        return error.response
    }
}