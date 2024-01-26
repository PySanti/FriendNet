import "../styles/UserFilter.css"
import {useUsersList} from "../store"
import {useUserKeyword} from "../store"
import {useEffect, useRef} from "react"


/**
 * Filtro de busqueda de usuarios
 */
export function UserFilter(){
    const userList = useUsersList((state)=>state.usersList)
    const inputRef = useRef(null)
    let [userKeyword, setUserKeyword] = useUserKeyword((state)=>([state.userKeyword, state.setUserKeyword]))
    const onLetterInput = (e)=>{
        // optimizacion
        if (!userKeyword || e.target.value.length <= userKeyword.length || userList.length > 0){
            setUserKeyword(e.target.value)
        }
    }
    useEffect(()=>{
        inputRef.current.value = userKeyword
    }, [])
    return (
        <div className="user-filter-container">
            <input ref={inputRef} placeholder="Busca un usuario" className="users-filter-input non-shadow-input" type="text" onChange={onLetterInput}/>
        </div>
    )
}
