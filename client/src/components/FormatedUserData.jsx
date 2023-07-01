

/**
 * Componente creado para ser usado en conjunto con api getUserDetail
 * Toma los elementos de props.userData y retorna una lista de 
 * <p>'s con los atributos formateados
 * @param {Object} userData datos de usuario a formatear
 * @param {Array} non_showable_attrs lista de atributos de objeto que no se formatearan
 * @param {Object} attrs_traductions objeto con atributo actual(clave) : traduccion (valor)
 */

import { UserDataItem } from "./UserDataItem"

export function FormatedUserData({userData, non_showable_attrs, attrs_traductions}){
    const formatingFunction = (key)=>{
        if (!(non_showable_attrs.includes(key))){
            let showKey = key
            if (Object.keys(attrs_traductions).includes(key)){
                showKey = attrs_traductions[key]
            }
            return <UserDataItem key={key} attr={showKey} value={userData[key]}/>
        }
    }
    const compList = Object.keys(userData).map(formatingFunction)
    return compList
}

