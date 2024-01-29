import { UserPhoto } from "./UserPhoto";
import "../styles/ClickedUserHeader.css"
import {useClickedUser, useTypingDB} from "../store"


/**
 * Cabecera del chat con datos del usuario
 */
export function ClickedUserHeader(){
    const clickedUser = useClickedUser((state)=>(state.clickedUser))
    const typingDB = useTypingDB((state)=>(state.typingDB))
    return (
        <div className="clicked-user-header-container">
            <UserPhoto photoFile={clickedUser.photo_link} chatPhoto/>
            <div className="clicked-user__username-container">
                <h3 className="clicked-user__username">{clickedUser.username}{clickedUser.is_online && ", en linea"}</h3>
                <h3 className={typingDB[clickedUser.id]? "clicked-user__typing clicked-user__typing__activated" : "clicked-user__typing"}>{typingDB[clickedUser.id] && "escribiendo ... "}</h3>
            </div>
        </div>
    )
}


