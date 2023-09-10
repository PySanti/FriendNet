/**
 * Retorna true en caso de que se haya clickeado un usuario nuevo
 */
export function diferentUserHasBeenClicked(lastClickedUser, newClickedUser){
    return (newClickedUser && (!lastClickedUser || lastClickedUser.id !== newClickedUser.id))
}