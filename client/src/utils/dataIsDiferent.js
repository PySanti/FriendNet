import {_} from "lodash"
/**
 * Esta funcion se usara en el apartado de actualizacion de perfil. Se usara
 * para comparar los datos de perfil actuales y los ingresados en el formulario
 * para comprobar si existen diferencias. En caso de existir retorna true. En
 * caso contrario false
 * @param {Object} formData
 * @param {Object} profileData
 */
export function dataIsDiferent(formData, profileData){
    formData.id             = profileData.id
    formData.is_active      = profileData.is_active
    formData.photo_link     = formData.photo ? true : profileData.photo_link
    delete formData.photo
    console.log(formData)
    console.log(profileData)
    return !_.isEqual(profileData, formData)
}