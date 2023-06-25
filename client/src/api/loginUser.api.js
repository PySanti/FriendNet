import axios from "axios";
import { BACKEND_URL } from "../main";

export async function loginUserAPI(username, password){
    try {
        const response = await axios.post(BACKEND_URL+'api/token/',{
            'username' : username,
            'password' : password
        })
        return response
    } catch(error){
        return error
    }
}