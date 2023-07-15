/**
 * Contenedor para foto de perfil de usuario
 * @param {String} url 
 */
import { useState } from "react"
import "../styles/UserPhoto.css"
import { FormField } from "./FormField"
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
            <img className="user-photo"src={currentPhoto ? currentPhoto : (url ? url : null)} alt="Imagen no encontrada!" width="100px" height="100px"></img>
            {withInput && 
                <>
                    <div className="user-photo-input-container">
                        <input  id="photo-input" className="user-photo-input" type="file" accept="" onChange={onPhotoChange} />
                        <Button msg="Seleccionar" onClickFunction={()=>document.getElementById("photo-input").click()}/>
                    </div>
                </>
            }
        </div>
    )
}