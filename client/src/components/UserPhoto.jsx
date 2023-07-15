/**
 * Contenedor para foto de perfil de usuario
 * @param {String} url 
 * @param {Boolean}  withInput sera true si se desea que el componente contenga una opcion para modificar la foto
 * @param {Function} photoFileSetter se ejecutara cuando se cambie la foto y la misma se le sera enviada por parametro. 
 * Diseniado para trabajar con states dentro de un formulario
 */
import { useState } from "react"
import "../styles/UserPhoto.css"
import { Button } from "./Button"

export function UserPhoto({url, withInput, photoFileSetter}){
    let [currentPhoto, setCurrentPhoto] = useState(false)
    const onPhotoChange = (e)=>{
        const file = e.target.files[0];
        photoFileSetter(e.target.files)
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            setCurrentPhoto(reader.result);
        });
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    return (
        <div className="user-photo-container">
            <img className="user-photo"src={currentPhoto ? currentPhoto : (url ? url : null)} alt="Imagen no encontrada!" ></img>
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