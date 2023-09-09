/**
 * Contenedor para foto de perfil de usuario
 * @param {String} photoFile sera la foto que se desea renderizar por defecto
 * @param {Boolean}  withInput sera true si se desea que el componente contenga una opcion para modificar la foto
 * @param {Function} photoFileSetter se ejecutara cuando se cambie la foto y la misma se le sera enviada por parametro.
 * @param {Boolean} chatPhoto sera true cuando sea una imagen para renderizar en el chat, de este modo le cambiaremos los estilos
 * Diseniado para trabajar con states dentro de un formulario
 */
import { useState, useRef } from "react";
import "../styles/UserPhoto.css";
import { Button } from "./Button";
import { PropTypes } from "prop-types";
import { checkImageFormat } from "../utils/checkImageFormat";

export function UserPhoto({photoFile,withInput,chatPhoto,photoFileSetter}) {
    let [errorMsg, setErrorMsg] = useState(null);
    let [currentPhotoName, setCurrentPhotoName] = useState(null);
    let [bigPhotoActivated, setBigPhotoActivated] = useState(false);
    const containerClsName = "user-photo-container";
    const smallImgClsName = "user-photo";
    const bigImgClsName = () => {
        return bigPhotoActivated? `${smallImgClsName} big-user-photo big-user-photo__activated`: `${smallImgClsName} big-user-photo`;
    };
    const imgProps = (type) => {
        return {
            onClick: ()=>setBigPhotoActivated(type === "small" ? true : false),
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
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                setCurrentPhotoName(reader.result);
            });
            if (file) {
                reader.readAsDataURL(file);
            }
        } else {
            setErrorMsg(imageCheckerResponse);
        }
    };

    return (
        <div className={    chatPhoto ? `${containerClsName} chat-photo` : containerClsName}>
            <div className="user-photo-smaller-container">
                <img {...imgProps("small")} />
                <img {...imgProps("big")} />
            </div>
            {withInput && (
                <>
                    <div className="img-input-error-msg-container">
                        <h3 className="img-input-error-msg">{errorMsg}</h3>
                    </div>
                    <div className="user-photo-input-container">
                        <input id="photo-input" className="user-photo-input" type="file" onChange={onPhotoChange}/>
                        <Button buttonText="Seleccionar" onClickFunction={() => document.getElementById("photo-input").click() }/>
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
