/**
 * Componente creado para renderizar atributos de usuario en dom
 * @param {String} key 
 * @param {String} attr clave 
 * @param {String} value valor 
 * @returns 
 */
export function UserDataItem({attr, value}){
    return (
        <div className="user-data-item-container">
            <p>{attr} : {value}</p>
        </div>
    )
}