/**
 * Retorna true en caso de que se haya clickeado un usuario nuevo
 * @param {Object} lastClickedUser
 * @param {Object} newClickedUser
 */
export function diferentUserHasBeenClicked(lastClickedUser, newClickedUser){
    return (newClickedUser.username && (!lastClickedUser || lastClickedUser.id !== newClickedUser.id))
}