import axios from 'axios'
import { BACKEND_URL } from '../main'


export async function checkExistingUserAPI(username, email){
    try{
        const response = await axios.get(BACKEND_URL + `api/create/check_existing_user/${username}/${email}`)
        return response
    } catch(error){
        console.log('Error checkeando usuario')
        return error 
    }

}