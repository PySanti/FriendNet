/**
 * Contenedor para foto de perfil de usuario
 * @param {String} url 
 */
import "../styles/UserPhoto.css"
export function UserPhoto({url}){
    return (
        <div className="user-photo-container">
            <img className="user-photo"src={url} alt="Imagen no encontrada!" width="100px" height="100px"></img>
        </div>
    )
}