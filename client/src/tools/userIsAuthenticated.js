/**
 * Retorna true en caso de que el usuario este autenticado
 */
export function userIsAuthenticated(){
    return localStorage.getItem('authToken')
}