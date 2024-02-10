import { FormField } from "./FormField";
import {PropTypes} from "prop-types"
import "../styles/PasswordField.css"
import { useState, useRef } from "react";
import padlock from "../../lottie/padlock"
import Lottie from "lottie-react"
import {BASE_PASSWORD_MAX_LENGTH} from "../utils/constants"

/**
 * Componente creado para campos de contrasenia
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 * @param {String} label
 */
export function PasswordField({errors, registerObject, label}){
    let [previsualizationActivated, setPrevisualizationActivated] = useState(false)
    const padlockAnimationRef = useRef()
    const handlePadlockClick = ()=>{
        setPrevisualizationActivated(!previsualizationActivated)
        padlockAnimationRef.current.setSpeed(4)
        padlockAnimationRef.current.playSegments(!previsualizationActivated ? [0,95] : [95,210], true)
    }
    return (
        <FormField  errors={errors}>
            <input 
                placeholder={label}
                className="password-input" 
                type={previsualizationActivated ? "text" : "password"} 
                name={registerObject.name} 
                maxLength={BASE_PASSWORD_MAX_LENGTH}
                {...registerObject}/>
            <div className="password-visualization" onClick={handlePadlockClick}>
                <Lottie 
                    loop={false}
                    autoplay={false}
                    animationData={padlock} 
                    lottieRef={padlockAnimationRef} 
                    />
            </div>
        </FormField>
    )
}

PasswordField.propTypes = {
    errors : PropTypes.string,
    label : PropTypes.string.isRequired,
    registerObject : PropTypes.object.isRequired,
}

PasswordField.defaultValues = {
    errors : undefined
}

