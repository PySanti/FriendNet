
/**
 * Redirigira al usuario expirado al root de la app para volver a logearse. 
 * @param {Func} navigateFunc funcion navigate del hook useNavigate creado desde la pagina concurrente
 */
export function redirectExpiredUser(navigateFunc){
    navigateFunc('/login/')
    localStorage.clear()
}