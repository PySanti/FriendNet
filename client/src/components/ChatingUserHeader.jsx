import { UserPhoto } from "./UserPhoto";
import {PropTypes} from "prop-types"
import "../styles/ChattingUserHeader.css"

/**
 * Cabecera del chat con datos del usuario
 * @param {Object} chatingUser datos del usuario con el que se esta chateando
 */
export function ChattingUserHeader({chatingUser, isOnline}){
    return (
        <div className="chatting-user-header-container">
            <UserPhoto photoFile={chatingUser.photo_link} chatPhoto/>
            <div className="chatting-user__username-container">
                <h3 className="chatting-user__username">{chatingUser.username}{isOnline && ", en linea"}</h3>
            </div>
        </div>
    )
}


ChattingUserHeader.propTypes = {
    chatingUser : PropTypes.object.isRequired,
    isOnline : PropTypes.bool.isRequired
}
