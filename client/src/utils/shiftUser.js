/**
 * Funcion creada para ser usada cuando se reciban notificaciones
 * 
 * Si el usuario que envio el mensaje no esta en la lista de usuarios,
 * sera agregado al principio de la lista
 */
export function shiftUser(usersList, usersListSetter, newUser){
    for (let i = 0; i < usersList.length ; i++){
        if (usersList[i].id === newUser.id){
            usersList.splice(i, 1)
        }
    }
    usersList.unshift(newUser)
    usersListSetter(usersList)
}