import {PropTypes} from "prop-types"
import "../styles/UserButton.css"
import {useClickedUser} from "../store"
import {useLastClickedUser} from "../store"
import {updateClickedUser} from "../utils/updateClickedUser"
import {useTypingDB} from "../store"
import {useChatGlobeList} from "../store"

/**
 * Retorna un userButton, button a renderizar en la UsersList
 * @param {Object} user
*/
export function UserButton({user}){
    let [clickedUser, setClickedUser]   = useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
    let typingDB                        = useTypingDB((state)=>(state.typingDB))
    let setLastClickedUser              = useLastClickedUser((state)=>(state.setLastClickedUser))
    let chatGlobeList                   = useChatGlobeList((state)=>(state.chatGlobeList))
    const globeCls                      = "user-button-globe"
    return (
        <button className="user-button" onClick={()=>updateClickedUser(clickedUser, user, setClickedUser, setLastClickedUser)}>
            <div className="user-username">
                {user.username}
                {typingDB[user.id] && " ..."}
            </div>
            <div className={chatGlobeList.includes(user.id)? `${globeCls} ${globeCls}__activated` : globeCls}></div>
        </button>
    )
}

UserButton.propTypes = {
    user : PropTypes.object.isRequired,
}
