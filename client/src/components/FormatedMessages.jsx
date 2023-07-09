export function FormatedMessages({messages, session_user_id }){
    const compList = messages.map((msg)=>{
            let margin = null
            if(session_user_id === msg.id){
                margin = "10vw"
            } else {
                margin = "0vw"
            }
            return <button style={{"margin-left" : margin}} key={msg.id}>{msg.content}</button>
        })
    return (
        <div className="messages-container">
            {compList}
        </div>
    )
}