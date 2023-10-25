import {PropTypes} from "prop-types"
import "../styles/UserButton.css"
import {useClickedUser} from "../store/clickedUserStore"
import {useLastClickedUser} from "../store/lastClickedUserStore"
import {updateClickedUser} from "../utils/updateClickedUser"

import {useChatGlobeList} from "../store/chatGlobeListStore"

/**
 * Retorna un userButton, button a renderizar en la UsersList
 * @param {Object} user
*/
export function UserButton({user}){
    let [clickedUser, setClickedUser]   = useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
    let setLastClickedUser              = useLastClickedUser((state)=>(state.setLastClickedUser))
    let chatGlobeList                   = useChatGlobeList((state)=>(state.chatGlobeList))

    return (
        <button className="user-button" onClick={()=>updateClickedUser(clickedUser, user, setClickedUser, setLastClickedUser)}>
            {user.username}
            {chatGlobeList.includes(user.id) &&<div className="user-button-globe">x</div>}
        </button>
    )
}

UserButton.propTypes = {
    user : PropTypes.object.isRequired,
}
