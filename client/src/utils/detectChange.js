import {emptyErrors} from "../utils/emptyErrors"

/**
 * Funcion creada para determinar si queremos detectar como cambio
 * un estado del formState en un useForm
 * 
 * Esto para determinar si el button sera hovered o no
 */
export function detectChange(form_type, formState, errors, watch, requiredData){
    if (emptyErrors(errors)){
        if (form_type == "change_email_for_activation"){
            return emptyErrors(errors) && watch("email") !== requiredData.userEmail ? true : false
        }
        if (form_type == "profile_update"){
            return watch("username") !== requiredData.username || watch("email") !== requiredData.email || requiredData.currentPhotoFile !== requiredData.photo_link ? true : false
        }
        if (form_type == "sign_up"){
            return watch("username") && watch("email") && watch("password") && watch("confirmPwd") ? true : false
        }
        if (form_type == "change_pwd"){
            return watch("newPwd") && watch("oldPwd") ?  true : false
        }
        if (form_type == "account_activation"){
            return watch("activationCode") == requiredData.realActivationCode ? true : false
        }
    } else {
        return false
    }
}