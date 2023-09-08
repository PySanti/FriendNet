import {useEffect, useRef} from "react"
import {PropTypes} from "prop-types"
import { Message } from "./Message"
import "../styles/MessagesContainer.css"
import { v4 } from "uuid"


/**
 * Recibe la lista de mensajes y retorna un contenedor HTML renderizable
 * @param {Array} messages lista de mensajes
 * @param {Number} sessionUserId  id de usuario de sesion
 * @param {Func} messagesUpdatingSetter  funcion para avisar cuando sea necesario actualizar lista de mensajes
 */
export function MessagesContainer({messages, sessionUserId, messagesUpdatingSetter }){
    const containerRef = useRef(null)
    const formatingFunction = (msg)=>{
        return <Message key={v4()} content={msg.content} sessionUserMsg={sessionUserId === msg.parent_id}/>
    }
    const scrollHandler = (e)=>{
        if (e.target.scrollTop <= 0){
            console.log('Actualizando lista de mensajes')
            messagesUpdatingSetter(true)
        }
    }
    useEffect(()=>{
        if (containerRef.current){
            containerRef.current.scrollTop = containerRef.current.clientHeight
        }
    }, [messages])
    return (
        <div className="messages-container">
            {messages.length !== 0 ?  
                <div className="messages-list-container" ref={containerRef} onScroll={scrollHandler}>
                    {messages.map(formatingFunction)}
                </div>
                : 
                <h3 className="messages-container__title">No hay mensajes :(</h3>
            }
        </div>
    )
}

MessagesContainer.propTypes = {
    messages : PropTypes.array,
    sessionUserId : PropTypes.number.isRequired,
    messagesUpdatingSetter : PropTypes.func.isRequired,
}
MessagesContainer.defaultProps = {
    messages : undefined
}