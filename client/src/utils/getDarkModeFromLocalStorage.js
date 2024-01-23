export function getDarkModeFromLocalStorage(){
    return (localStorage.getItem("darkMode") == undefined ||  localStorage.getItem("darkMode") == "false") ? false : true;
}