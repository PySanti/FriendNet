/**
 * Contenedor para foto de perfil de usuario
 * @param {String} url 
 * @param {Boolean}  withInput sera true si se desea que el componente contenga una opcion para modificar la foto
 * @param {Function} photoFileSetter se ejecutara cuando se cambie la foto y la misma se le sera enviada por parametro. 
 * @param {Boolean} chatPhoto sera true cuando sea una imagen para renderizar en el chat, de este modo le cambiaremos los estilos
 * Diseniado para trabajar con states dentro de un formulario
 */
import { useState } from "react"
import "../styles/UserPhoto.css"
import { Button } from "./Button"
import {PropTypes} from "prop-types"

export function UserPhoto({url, withInput, photoFileSetter, chatPhoto}){
    let [currentPhoto, setCurrentPhoto] = useState(false)
    const containerClsName = "user-photo-container"
    const onPhotoChange = (e)=>{
        const file = e.target.files[0];
        if (photoFileSetter){
            photoFileSetter(e.target.files)
        }
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            setCurrentPhoto(reader.result);
        });
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    return (
        <div className={chatPhoto ? `${containerClsName} chat-photo` : containerClsName}>
            <img className="user-photo"src={currentPhoto ? currentPhoto : (url ? url : null)} alt=":(" ></img>
            {withInput && 
                <>
                    <div className="user-photo-input-container">
                        <input  id="photo-input" className="user-photo-input" type="file" accept="" onChange={onPhotoChange} />
                        <Button buttonText="Seleccionar" onClickFunction={()=>document.getElementById("photo-input").click()}/>
                    </div>
                </>
            }
        </div>
    )
}

UserPhoto.propTypes = {
    url : PropTypes.string,
    withInput : PropTypes.bool,
    photoFileSetter : PropTypes.func,
    chatPhoto : PropTypes.bool,
}

UserPhoto.defaultProps = {
    url : undefined,
    withInput : undefined,
    photoFileSetter : undefined,
    chatPhoto : undefined,
}
