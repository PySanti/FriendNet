/**
 * Componente creado para contener label's en FormField's
 * @param {String} msg contenido del label
 */
export function Label({msg}){
    return (
        <label className="form-label">{msg} : </label>
    )
}