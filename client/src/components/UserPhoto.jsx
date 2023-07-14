/**
 * Contenedor para foto de perfil de usuario
 * @param {String} url 
 */
import { useState } from "react"
import "../styles/UserPhoto.css"
import { FormField } from "./FormField"
import { Button } from "./Button"
export function UserPhoto({url, withInput}){
    let [currentPhoto, setCurrentPhoto] = useState(null)
    const onPhotoChange = (e)=>{
        const file = e.target.files[0];
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
            {!withInput && <img className="user-photo"src={url} alt="Imagen no encontrada!" width="100px" height="100px"></img>}
            {withInput && 
                <>
                    <img className="user-photo"src={currentPhoto} alt="Imagen no encontrada!" width="100px" height="100px"></img>
                    <div className="user-photo-input-container">
                        <input  id="photo-input" className="user-photo-input" type="file" accept="" onChange={onPhotoChange}/>
                        <Button msg="Seleccionar" onClickFunction={()=>document.getElementById("photo-input").click()}/>
                    </div>
                </>
            }
        </div>
    )
}