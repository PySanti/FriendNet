import { UserPhoto } from "./UserPhoto";
import {PropTypes} from "prop-types"

/**
 * Cabecera del chat con datos del usuario
 * @param {Object} chatingUser datos del usuario con el que se esta chateando
 */
export function ChattingUserHeader({chatingUser}){
    return (
        <div className="chatting-user-header">
            <UserPhoto url={chatingUser.photo_link}/>
            <div className="chatting-user__username-container">
                <h3 className="chatting-user__username">{chatingUser.username}</h3>
            </div>
        </div>
    )
}


ChattingUserHeader.propTypes = {
    chatingUser : PropTypes.object.isRequired
}
