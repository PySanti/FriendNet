/**
 * Funcion diseniada para actualizar los states globales lastClickedUser y clickedUser
 * 
 * Esta misma funcion es usada por lo menos en dos componentes y para evitar uso de props, la creamos
 */
export function updateClickedUser(clickedUser, newClickedUser, clickedUserSetter, lastClickedUserSetter){
    clickedUserSetter(clickedUser);
    lastClickedUserSetter(newClickedUser)
}