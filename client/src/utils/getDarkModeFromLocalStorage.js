import {LOCAL_STORAGE_DARK_MODE_NAME} from "./constants"
export function getDarkModeFromLocalStorage(){
    return (localStorage.getItem(LOCAL_STORAGE_DARK_MODE_NAME) == undefined ||  localStorage.getItem(LOCAL_STORAGE_DARK_MODE_NAME) == "false") ? false : true;
}