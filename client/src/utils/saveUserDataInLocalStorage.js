export function saveUserDataInLocalStorage(userData){
    localStorage.setItem('userData',JSON.stringify(userData))
}