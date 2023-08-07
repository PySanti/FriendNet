/**
 * Componente creado para ser usado en conjunto con api getUserDetail
 * Toma los elementos de props.userData y retorna una lista de 
 * <p>'s con los atributos formateados
 * @param {Object} userData datos de usuario a formatear
 * @param {Array} nonShowableAttrs lista de atributos de objeto que no se formatearan
 * @param {Object} attrsTraductions objeto con atributo actual(clave) : traduccion (valor)
 */
import {PropTypes} from "prop-types"
import { v4 } from "uuid"

export function UserData({userData, nonShowableAttrs, attrsTraductions}){
    const formatingFunction = (key)=>{
        if (!(nonShowableAttrs.includes(key))){
            let showKey = key
            if (Object.keys(attrsTraductions).includes(key)){
                showKey = attrsTraductions[key]
            }
            return (
                <div key={v4()} className="user-data-item">
                    <p key={v4()}>{showKey} : {userData[key]}</p>
                </div>
            )
        }
    }
    return (
        <div className="user-data-container">
            {Object.keys(userData).map(formatingFunction)}
        </div>
    )
}

UserData.propTypes = {
    userData : PropTypes.object.isRequired,
    nonShowableAttrs : PropTypes.array.isRequired,
    attrsTraductions : PropTypes.object.isRequired,
}