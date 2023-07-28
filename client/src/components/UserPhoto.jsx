/**
 * Contenedor para foto de perfil de usuario
 * @param {String} photoFile sera la foto que se desea renderizar por defecto 
 * @param {Boolean}  withInput sera true si se desea que el componente contenga una opcion para modificar la foto
 * @param {Function} photoFileSetter se ejecutara cuando se cambie la foto y la misma se le sera enviada por parametro. 
 * @param {Boolean} chatPhoto sera true cuando sea una imagen para renderizar en el chat, de este modo le cambiaremos los estilos
 * Diseniado para trabajar con states dentro de un formulario
 */
import {useState } from "react"
import "../styles/UserPhoto.css"
import { Button } from "./Button"
import {PropTypes} from "prop-types"
import { checkImageFormat } from "../utils/checkImageFormat"
import { isLink } from "../utils/isLink"
import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";

// Import required actions.
import { scale} from "@cloudinary/url-gen/actions/resize";
import { getPublicId } from "../utils/getPublicId"
import { quality } from "@cloudinary/url-gen/actions/delivery"
import { auto } from "@cloudinary/url-gen/qualifiers/quality"


export function UserPhoto({photoFile, withInput, chatPhoto, photoFileSetter}){
    let [errorMsg, setErrorMsg]         = useState(null)
    let [currentPhotoName, setCurrentPhotoName] = useState(null)
    let [cloud, setCloud]  =    useState(false)
    let [bigPhotoActivated, setBigPhotoActivated] = useState(false)
    const containerClsName = "user-photo-container"
    const getCloud = ()=>{
        return new Cloudinary({
            cloud: {
                cloudName: 'dwcabo8hs'
            }
        })
    }
    const getFormatedImage = (cloud)=>{
        const myImage = cloud.image(getPublicId(getCurrentPhoto()))
        myImage
            .resize(scale().width(80))
            .delivery(quality(auto()))
        return myImage
    }
    const getAdvancedImage = ()=>{
        if (!cloud){
            let cloud = getCloud()
            setCloud(cloud)
            return getFormatedImage(cloud)
        } else {
            return getFormatedImage(cloud)
        } 
    }
    const getCurrentPhoto = ()=>{
        return currentPhotoName ? currentPhotoName : (photoFile ? photoFile :  null)
    }
    const deleteCurrentPhoto = ()=>{
        photoFileSetter(null)
        setCurrentPhotoName(null)
    }
    const onPhotoChange = (e)=>{
        const file = e.target.files[0];
        const imageCheckerResponse = checkImageFormat(file)
        if (imageCheckerResponse === true){
            photoFileSetter(file)
            setErrorMsg(null)
            const reader = new FileReader();
            reader.addEventListener('load', function() {
                setCurrentPhotoName(reader.result)
            });
            if (file) {
                reader.readAsDataURL(file);
            }
        } else {
            setErrorMsg(imageCheckerResponse)
        }
    }

    return (
        <div className={chatPhoto ? `${containerClsName} chat-photo` : containerClsName}>
            {
                isLink(getCurrentPhoto()) ?
                    <AdvancedImage className="user-photo" cldImg={getAdvancedImage()}/>
                :
                <>
                    <img 
                        className="user-photo"
                        src={getCurrentPhoto()} 
                        alt=":(" 
                        onClick={()=>setBigPhotoActivated(true)}
                    />
                    <img 
                        className={bigPhotoActivated ? `user-photo big-user-photo big-user-photo__activated` : `user-photo big-user-photo`}
                        src={getCurrentPhoto()} 
                        alt=":(" 
                        onClick={()=>setBigPhotoActivated(false)}
                    />
                </>
            }

            {withInput && 
                <>
                    <div className="img-input-error-msg-container">
                        <h3 className="img-input-error-msg">{errorMsg}</h3>
                    </div>
                    <div className="user-photo-input-container">
                        <input  id="photo-input" className="user-photo-input" type="file"  onChange={onPhotoChange} />
                        <Button buttonText="Seleccionar" onClickFunction={()=>document.getElementById("photo-input").click()}/>
                        <Button buttonText="Borrar" onClickFunction={deleteCurrentPhoto}/>
                    </div>
                </>
            }
        </div>
    )
}

UserPhoto.propTypes = {
    photoFile : PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]) ,
    withInput : PropTypes.bool,
    photoFileSetter : PropTypes.func,
    chatPhoto : PropTypes.bool,
}

UserPhoto.defaultProps = {
    photoFile : undefined,
    withInput : undefined,
    photoFileSetter : undefined,
    chatPhoto : undefined,
}
