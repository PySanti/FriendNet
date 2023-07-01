/**
 * Contenedor para foto de perfil de usuario
 * @param {String} url 
 */
export function UserPhoto({url}){
    return (
        <div className="user-photo-container">
            <img src={url} alt="Imagen no encontrada!" width="100px" height="100px"></img>
        </div>
    )
}