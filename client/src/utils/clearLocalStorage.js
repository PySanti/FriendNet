import {getDarkModeFromLocalStorage} from "../utils/getDarkModeFromLocalStorage"
import {LOCAL_STORAGE_DARK_MODE_NAME} from "./constants"
export function clearLocalStorage(){
    const darkMode = getDarkModeFromLocalStorage()
    localStorage.clear()
    localStorage.setItem(LOCAL_STORAGE_DARK_MODE_NAME, darkMode)
}