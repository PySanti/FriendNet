import {PropTypes} from "prop-types"
import "../styles/UserButton.css"
import {useClickedUser} from "../store"
import {useLastClickedUser} from "../store"
import {updateClickedUser} from "../utils/updateClickedUser"

import {useChatGlobeList} from "../store"

/**
 * Retorna un userButton, button a renderizar en la UsersList
 * @param {Object} user
*/
export function UserButton({user}){
    let [clickedUser, setClickedUser]   = useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
    let setLastClickedUser              = useLastClickedUser((state)=>(state.setLastClickedUser))
    let chatGlobeList                   = useChatGlobeList((state)=>(state.chatGlobeList))
    const globeCls                      = "user-button-globe"
    return (
        <button className="user-button" onClick={()=>updateClickedUser(clickedUser, user, setClickedUser, setLastClickedUser)}>
            <div className="user-username">
                {user.username}
                {user.is_typing && " ..."}
            </div>
            <div className={chatGlobeList.includes(user.id)? `${globeCls} ${globeCls}__activated` : globeCls}></div>
        </button>
    )
}

UserButton.propTypes = {
    user : PropTypes.object.isRequired,
}
