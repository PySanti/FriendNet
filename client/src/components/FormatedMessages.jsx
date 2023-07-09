/**
 * Recibe la lista de mensajes y retorna un contenedor HTML renderizable
 * @param {Array} messages lista de mensajes
 * @param {Number} session_user_id 
 */
export function FormatedMessages({messages, session_user_id }){
    let compList = undefined
    if (messages){
        compList =  messages.map((msg)=>{
            const margin = session_user_id === msg.parent_id? "flex-end" : "flex-start"
            return <button style={{"alignSelf" : margin}} key={msg.id}>{msg.content}</button>
        })
    }
    return (
        <div className="messages-container">
            {compList && compList}
            {!compList && <h3>Selecciona un usuario</h3>}
        </div>
    )
}