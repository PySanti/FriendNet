import { FormField } from "./FormField";
import {PropTypes} from "prop-types"
import "../styles/PasswordField.css"
import { useState, useRef } from "react";
import eye from "../../lottie/eye"
import Lottie from "lottie-react"

/**
 * Componente creado para campos de contrasenia
 * @param {Object} errors coleccion de errores del campo creado desde el formulario
 * @param {Object} registerObject objecto devuelto por funcion register del useForm
 * @param {String} label
 */
export function PasswordField({errors, registerObject, label}){
    let [previsualizationActivated, setPrevisualizationActivated] = useState(false)
    const eyeAnimationRef = useRef()
    const handleEyeClick = ()=>{
        setPrevisualizationActivated(!previsualizationActivated)
        eyeAnimationRef.current.setSpeed(3)
        eyeAnimationRef.current.playSegments(!previsualizationActivated ? [0,60] : [60,0], true)
    }
    return (
        <FormField  errors={errors}>
            <input 
                placeholder={label}
                className="password-input" 
                type={previsualizationActivated ? "text" : "password"} 
                name={registerObject.name} 
                {...registerObject}/>
            <div className="password-visualization" onClick={handleEyeClick}>
                <Lottie 
                    loop={false}
                    autoplay={false}
                    animationData={eye} 
                    lottieRef={eyeAnimationRef} 
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

