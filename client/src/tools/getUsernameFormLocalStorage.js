import jwt_decode from "jwt-decode";

export function getUsernameFromLocalStorage(){
    return jwt_decode(localStorage.getItem('authToken')).username
}