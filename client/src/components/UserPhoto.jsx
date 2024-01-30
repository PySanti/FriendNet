import Lottie from "lottie-react"
import loading from "../../lottie/loading.json"
import {toast} from "sonner"
import { useState,useRef, useEffect } from "react";
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
    const loadingAnimationRef                       = useRef(null)
    let modalContainerRef                           = useRef(null)
    let [userPhotoLoaded, setUserPhotoLoaded]       = useState(false);
    let [currentPhotoName, setCurrentPhotoName]     = useState(null);
    const userPhotoRef                              = useRef(null)
    const imgInputRef                                 = useRef(null)
    const containerClsName                          = "main-container";
    const handleImgClick = ()=>{
        if (photoFile && userPhotoLoaded){
            modalContainerRef.current.classList.toggle("modal-container__activated")
            setTimeout(() => {
                modalContainerRef.current.style.opacity = modalContainerRef.current.style.opacity == "1"? "0" : "1" ;
            }, 10);
        }
    }
    const imgProps = (type) => {
        return {
            onClick: handleImgClick,
            className: type === "small" ? (userPhotoLoaded || !photoFile? "user-photo user-photo__activated" : "user-photo") : `big-user-photo`,
            src: currentPhotoName? currentPhotoName: photoFile? photoFile: null,
            alt: ":(",
            ref : type=="small"? userPhotoRef : null
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
            getImageFileName(file, setCurrentPhotoName)
        } else {
            toast.error(imageCheckerResponse)
        }
    };
    useEffect(()=>{
        setUserPhotoLoaded(false)
        if (photoFile){
            userPhotoRef.current.addEventListener("load", ()=>{
                setUserPhotoLoaded(true)
            })
        }
    }, [photoFile])
    return (
        <div className={    chatPhoto ? `${containerClsName} chat-photo` : containerClsName}>
            <div className="user-photo-container" >
                <img {...imgProps("small")}/>
                {(!userPhotoLoaded && photoFile) &&
                    <div className="loading-animation-container">
                        <Lottie 
                            loop={true}
                            autoPlay={true}
                            animationData={loading} 
                            lottieRef={loadingAnimationRef}
                        />
                    </div>
                }

                <div className="modal-container" ref={modalContainerRef}>
                    <img {...imgProps("big")}/>
                </div>
            </div>
            {withInput && (
                <>
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
