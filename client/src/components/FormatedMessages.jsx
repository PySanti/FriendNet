export function FormatedMessages({messages, session_user_id }){
    const compList = messages.map((msg)=>{
            let margin = null
            if(session_user_id === msg.parent_id){
                margin = "flex-end"
            } else {
                console.log('mensajes de ', msg.parent_id)
                margin = "flex-start"
            }
            return <button style={{"align-self" : margin}} key={msg.id}>{msg.content}</button>
        })
    return (
        <div className="messages-container">
            {compList}
        </div>
    )
}