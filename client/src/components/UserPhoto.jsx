
import { useState,useRef } from "react";
import "../styles/UserPhoto.css";
import { Button } from "./Button";
import { PropTypes } from "prop-types";
import { checkImageFormat } from "../utils/checkImageFormat";
import {getImageFileName} from "../utils/getImageFileName"

/**
 * Contenedor para foto de perfil de usuario
 * @param {String} photoFile sera la foto que se desea renderizar por defecto
 * @param {Boolean}  withInput sera true si se desea que el componente contenga una opcion para modificar la foto
 * @param {Function} photoFileSetter se ejecutara cuando se cambie la foto y la misma se le sera enviada por parametro.
 * @param {Boolean} chatPhoto sera true cuando sea una imagen para renderizar en el chat, de este modo le cambiaremos los estilos
 * Diseniado para trabajar con states dentro de un formulario
 */
export function UserPhoto({photoFile,withInput,chatPhoto,photoFileSetter}) {
    let modalContainerRef                           = useRef(null)
    let [errorMsg, setErrorMsg]                     = useState(null);
    let [currentPhotoName, setCurrentPhotoName]     = useState(null);
    let [bigPhotoActivated, setBigPhotoActivated]   = useState(false);
    const imgInputRef                                 = useRef(null)
    const containerClsName                          = "user-photo-container";
    const smallImgClsName                           = "user-photo";
    const bigImgClsName = () => {
        return bigPhotoActivated? `${smallImgClsName} big-user-photo big-user-photo__activated`: `${smallImgClsName} big-user-photo`;
    };
    const handleSmallImgClick = (imgType) =>{
        return ()=>{
            if (photoFile){
                modalContainerRef.current.classList.toggle("modal-container__activated")
                setBigPhotoActivated(imgType === "small"? true : false)
            }
        }
    }
    const imgProps = (type) => {
        return {
            onClick: handleSmallImgClick(type),
            className: type === "small" ? smallImgClsName : bigImgClsName(),
            src: currentPhotoName? currentPhotoName: photoFile? photoFile: null,
            alt: ":(",
        };
    };
    const deleteCurrentPhoto = () => {
        photoFileSetter(null);
        setCurrentPhotoName(null);
    };
    const onPhotoChange = (e) => {
        const file = e.target.files[0];
        const imageCheckerResponse = checkImageFormat(file);
        if (imageCheckerResponse === true) {
            photoFileSetter(file);
            setErrorMsg(null);
            getImageFileName(file, setCurrentPhotoName)
        } else {
            setErrorMsg(imageCheckerResponse);
        }
    };

    return (
        <div className={    chatPhoto ? `${containerClsName} chat-photo` : containerClsName}>
            <div className="user-photo-smaller-container" >
                <img {...imgProps("small")} />
                <div className="modal-container" ref={modalContainerRef}>
                    <img {...imgProps("big")} />
                </div>
            </div>
            {withInput && (
                <>
                    <div className="img-input-error-msg-container">
                        <h3 className={!errorMsg ? "img-input-error-msg" : "img-input-error-msg img-input-error-msg__activated"}>{errorMsg}</h3>
                    </div>
                    <div className="user-photo-input-container">
                        <input ref={imgInputRef} className="user-photo-input" type="file" onChange={onPhotoChange}/>
                        <Button buttonText="Seleccionar" onClickFunction={() => imgInputRef.current.click() }/>
                        <Button buttonText="Borrar" onClickFunction={deleteCurrentPhoto} />
                    </div>
                </>
            )}
        </div>
    );
}

UserPhoto.propTypes = {
    photoFile: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    withInput: PropTypes.bool,
    photoFileSetter: PropTypes.func,
    chatPhoto: PropTypes.bool,
};

UserPhoto.defaultProps = {
    photoFile: undefined,
    withInput: undefined,
    photoFileSetter: undefined,
    chatPhoto: undefined,
};
