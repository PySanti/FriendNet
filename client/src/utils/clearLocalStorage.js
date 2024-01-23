import {getDarkModeFromLocalStorage} from "../utils/getDarkModeFromLocalStorage"
export function clearLocalStorage(){
    const darkMode = getDarkModeFromLocalStorage()
    localStorage.clear()
    localStorage.setItem("darkMode", darkMode)
}