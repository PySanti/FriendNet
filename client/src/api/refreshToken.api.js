import axios from "axios";
import { BACKEND_URL } from "../main";

export async function refreshTokenAPI(refreshToken){
    const response = await axios.post(BACKEND_URL+"api/token/refresh/",{
        refresh : refreshToken
    })
    return response
}