export function userIsAuthenticated(){
    return localStorage.getItem('authToken')
}