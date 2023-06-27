import axios from "axios";
import { BACKEND_URL } from "../main";
import { config } from "./baseConfig.api";

export async function getUserDetailAPI(username){
    /**
     * Recibe nombre de usuario, retorna la informacion "showable" del mismo
     */
    const data = {
        'username' : username
    }
    return await axios.post(BACKEND_URL + 'api/get_user_detail/', data, config)
}