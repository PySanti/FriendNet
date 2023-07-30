/**
 * Contenedor para foto de perfil de usuario
 * @param {String} photoFile sera la foto que se desea renderizar por defecto 
 * @param {Boolean}  withInput sera true si se desea que el componente contenga una opcion para modificar la foto
 * @param {Function} photoFileSetter se ejecutara cuando se cambie la foto y la misma se le sera enviada por parametro. 
 * @param {Boolean} chatPhoto sera true cuando sea una imagen para renderizar en el chat, de este modo le cambiaremos los estilos
 * Diseniado para trabajar con states dentro de un formulario
 */
import { useState } from "react"
import "../styles/UserPhoto.css"
import { Button } from "./Button"
import {PropTypes} from "prop-types"
import { checkImageFormat } from "../utils/checkImageFormat"
import { isLink } from "../utils/isLink"
import {AdvancedImage,  lazyload, placeholder} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";

// Import required actions.
import { getPublicId } from "../utils/getPublicId"
import { quality, format } from "@cloudinary/url-gen/actions/delivery"
import { auto, autoBest } from "@cloudinary/url-gen/qualifiers/quality"
import { limitFit } from "@cloudinary/url-gen/actions/resize"


export function UserPhoto({photoFile, withInput, chatPhoto, photoFileSetter}){
    let [errorMsg, setErrorMsg]                     = useState(null)
    let [currentPhotoName, setCurrentPhotoName]     = useState(null)
    let [cloud]                                     = useState(new Cloudinary({cloud: {cloudName: 'dwcabo8hs', url: {cdn_subdomain: false, useRootPath: true, shorten: true, secure: true} }}))

    let [bigPhotoActivated, setBigPhotoActivated]   = useState(false)
    const containerClsName = "user-photo-container"
    const smallImgClsName = "user-photo"
    const bigImgClsName = ()=>{
        return bigPhotoActivated ? `${smallImgClsName} big-user-photo big-user-photo__activated` : `${smallImgClsName} big-user-photo`
    }
    const imgProps = (format,type)=>{
        const baseProps = {
            onClick     : onImgClick(type),
            className   : type === "small" ? smallImgClsName : bigImgClsName(),
        }
        if (format === "advanced"){
            return {
                ...baseProps,
                cldImg      : getFormatedImage(),
                plugins     : [lazyload({rootMargin: '10px 20px 10px 30px', threshold: 0.25}), placeholder({'mode' : 'blur'})]
            }
        } else if (format==="simple"){
            return {
                ...baseProps,
                src         :getCurrentPhoto(),
                alt         :":(" 
            }
        }
        
    }
    const onImgClick = (type)=>{
        return ()=>setBigPhotoActivated(type === "small" ? true : false)
    }
    const getCurrentPhoto = ()=>{
        return currentPhotoName ? currentPhotoName : (photoFile ? photoFile :  null)
    }
    const getFormatedImage = ()=>{
        console.log('llamadno')
        const myImage = cloud.image(getPublicId(getCurrentPhoto()))
        console.log(myImage.toURL())
        myImage
            .resize(limitFit().width(400))
            .delivery(quality(autoBest()))
            .delivery(format(auto()))
        console.log(myImage.toURL())
        return myImage
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
                    <>
                        <AdvancedImage  {...imgProps("advanced","small")}/>
                        <AdvancedImage  {...imgProps("advanced","big")}/>
                    </>
                    :
                    <>
                        <img    {...imgProps("simple","small")} />
                        <img    {...imgProps("simple","big")} />
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
