/**
 * Funcion creada para actualizar el usersIdList cada vez que se actualice la lista de usuarios
 */
export function updateUsersIdList(usersIdList, usersList, usersIdListSetter){
    usersList.forEach(user => {        
        if (!usersIdList.includes(user.id)){
            usersIdList.push(user.id)
        }
    });
    usersIdListSetter(usersIdList)
}