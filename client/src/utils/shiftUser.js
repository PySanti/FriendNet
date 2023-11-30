/**
 * Funcion creada para ser usada cuando se reciban notificaciones
 * 
 * Si el usuario que envio el mensaje no esta en la lista de usuarios,
 * sera agregado al principio de la lista
 */
export function shiftUser(usersList, usersListSetter, newUser, usersIdList, usersIdListSetter){
    for (let i = 0; i < usersList.length ; i++){
        if (usersList[i].id === newUser.id){
            usersList.splice(i, 1)
        }
    }
    if (!usersIdList.includes(newUser.id)){
        usersIdListSetter(usersIdList.concat([newUser.id]))
    }
    usersList.unshift(newUser)
    console.log(usersList)
    console.log(usersIdList.concat([newUser.id]))
    usersListSetter(usersList)
}