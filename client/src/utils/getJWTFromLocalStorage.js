/**
 * Toma el JWT del local storage y lo retorna
 */
export function getJWTFromLocalStorage(){
    return JSON.parse(localStorage.getItem('authToken'))
}