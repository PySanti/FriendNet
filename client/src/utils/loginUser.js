import { loginUserAPI } from "../api/loginUser.api";
/**
 * Recibe los datos del usuario cargados desde el formulario, llama a api para logear usuario y setea
 * el JWT en el localStorage
 * @param {Object} data 
 */
export async function loginUser(data){
    const response = await loginUserAPI(data.username, data.password)
    localStorage.setItem('authToken', JSON.stringify(response.data))
    return response
}