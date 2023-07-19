
export function getUserDataFromLocalStorage(){
    return JSON.parse(localStorage.getItem('userData'))
}