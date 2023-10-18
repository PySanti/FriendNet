import { UserPhoto } from "./UserPhoto";
import {PropTypes} from "prop-types"
import "../styles/ChattingUserHeader.css"
import {useClickedUser} from "../store/clickedUserStore"


/**
 * Cabecera del chat con datos del usuario

 */
export function ChattingUserHeader(){
    const clickedUser                                                   = useClickedUser((state)=>(state.clickedUser))
    return (
        <div className="chatting-user-header-container">
            <UserPhoto photoFile={clickedUser.photo_link} chatPhoto/>
            <div className="chatting-user__username-container">
                <h3 className="chatting-user__username">{clickedUser.username}{clickedUser.is_online && ", en linea"}</h3>
                <h3 className="chatting-user__typing">{clickedUser.is_typing && "escribiendo ... "}</h3>
            </div>
        </div>
    )
}


