import axios from "axios";
import { BACKEND_URL } from "../main";

export async function getUserDetailAPI(username){
    const response = await axios.post(BACKEND_URL + 'api/get_user_detail/', {
        'username' : username
    })
    return response
}