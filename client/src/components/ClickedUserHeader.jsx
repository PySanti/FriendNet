import { UserPhoto } from "./UserPhoto";
import "../styles/ClickedUserHeader.css"
import {useClickedUser} from "../store"


/**
 * Cabecera del chat con datos del usuario
 */
export function ClickedUserHeader(){
    const clickedUser = useClickedUser((state)=>(state.clickedUser))
    return (
        <div className="clicked-user-header-container">
            <UserPhoto photoFile={clickedUser.photo_link} chatPhoto/>
            <div className="clicked-user__username-container">
                <h3 className="clicked-user__username">{clickedUser.username}{clickedUser.is_online && ", en linea"}</h3>
                <h3 className="clicked-user__typing">{clickedUser.is_typing && "escribiendo ... "}</h3>
            </div>
        </div>
    )
}


