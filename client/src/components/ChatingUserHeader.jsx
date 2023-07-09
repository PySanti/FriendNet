import { UserPhoto } from "./UserPhoto";

/**
 * Cabecera del chat con datos del usuario
 * @param {Object} chatingUser
 */
export function ChattingUserHeader({chatingUser}){
    return (
        <div className="chatting-user-header">
            <UserPhoto url={chatingUser.photo_link}/>
            <h3>{chatingUser.username}</h3>
        </div>
    )
}