import "../styles/UserFilter.css"
import {useUsersList} from "../store"
import {useUserKeyword, useUserFilterInput} from "../store"
import {useEffect, useRef} from "react"


/**
 * Filtro de busqueda de usuarios
 */
export function UserFilter(){
    const userList = useUsersList((state)=>state.usersList)
    const inputRef = useRef(null)
    let [userKeyword, setUserKeyword] = useUserKeyword((state)=>([state.userKeyword, state.setUserKeyword]))
    let [userFilterInput, setUserFilterInput] = useUserFilterInput((state)=>([state.userFilterInput, state.setUserFilterInput]))
    const onLetterInput = (e)=>{
        setUserFilterInput(e.target.value)
        // optimizacion
        if (!userKeyword || e.target.value.length <= userKeyword.length || userList.length > 0){
            setUserKeyword(e.target.value)
        }
    }
    useEffect(()=>{
        inputRef.current.value = userFilterInput
    }, [])
    return (
        <div className="user-filter-container">
            <input ref={inputRef} placeholder="Busca un usuario" className="users-filter-input non-shadow-input" type="text" onChange={onLetterInput}/>
        </div>
    )
}
