import {PropTypes} from "prop-types"
import { v4 } from "uuid"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"

/**
 * Componente creado para ser usado en conjunto con api getUserDetail
 * Toma los elementos de props.userData y retorna una lista de 
 * <p>'s con los atributos formateados
  * @param {Array} nonShowableAttrs lista de atributos de objeto que no se formatearan
 * @param {Object} attrsTraductions objeto con atributo actual(clave) : traduccion (valor)
 */
export function UserData({nonShowableAttrs, attrsTraductions}){
    const userData = getUserDataFromLocalStorage()
    let showKey = null
    const formatingFunction = (key)=>{
        if (!(nonShowableAttrs.includes(key))){
            showKey = Object.keys(attrsTraductions).includes(key) ? attrsTraductions[key] : key
            return (
                <div key={v4()} className="user-data-item">
                    <p className="user-data-item__content" key={v4()}>{showKey} : {userData[key]}</p>
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
    nonShowableAttrs : PropTypes.array.isRequired,
    attrsTraductions : PropTypes.object.isRequired,
}