/**
 * Recibe la lista de usuarios y el id de un usuario en esa lista y lo retorna en caso
 * de encontrarlo, en caso contrario retorna null.
 * @param {Array} usersList
 * @param {String} id
 */
export function getUserFromList(usersList, id){
    for (let u in usersList){
        console.log(usersList[u])
        if (usersList[u].id == id){
            return usersList[u]
        }
    }
    return null
}