/**
 * Recibe un objeto event producto de un scroll y retorna true en caso de
 * que el usuario haya tocado el final del contenedor al scrollear
 * @param {Object} event objeto producto de evento
 */
export function bottomOfContainer(event){
    return (event.target.scrollTop + event.target.clientHeight) >= event.target.scrollHeight
}