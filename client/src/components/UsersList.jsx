import { UserButton } from "./UserButton"
import {PropTypes} from "prop-types"
import "../styles/UsersList.css"
import { v4 } from "uuid"
import { UserFilter } from "./UserFilter"
import {useState, useEffect, useRef} from "react"
import { getUsersListAPI } from "../api/getUsersList.api"
import {BASE_FALLEN_SERVER_ERROR_MSG, BASE_FALLEN_SERVER_LOG} from "../utils/constants"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import {useLoadingState} from "../store/loadingStateStore"
import {useChatGlobeList} from "../store/chatGlobeListStore"
/**
 * Recibe la lista de usuarios directa de la api y retorna la lista de elementos jsx
 * @param {Function} onClickEvent evento a ejecutar cuando los usersButtons sean presionado
 */
export function UsersList({onClickEvent }){
    const loaderClassName                                           ="users-list-loader" 
    const  setLoadingState                                          = useLoadingState((state)=>(state.setLoadingState))
    let userListPage                                                = useRef(1)
    let noMoreUsers                                                 = useRef(false)
    let [loaderActivated, setLoaderActivated]                       = useState(true)
    let [usersList, setUsersList]                                   = useState([])
    let [ userKeyword, setUserKeyword]                               = useState(undefined)
    let chatGlobeList                                             = useChatGlobeList((state)=>(state.chatGlobeList))


    const updateUserList = (newUsers)=>{
        if (userListPage.current === 1){
            setUsersList(newUsers)
        } else {
            setUsersList(usersList.concat(newUsers))
        }
    }
    const loadUsersList = async ()=>{
        try{
            setLoaderActivated(true)
            let response = await getUsersListAPI(!userKeyword || userKeyword.length === 0 ? undefined : userKeyword, getUserDataFromLocalStorage().id, userListPage.current)
            updateUserList(response.data.users_list)
            setLoaderActivated(false)
        } catch(error){
            if (error.message === BASE_FALLEN_SERVER_ERROR_MSG){
                setLoadingState(BASE_FALLEN_SERVER_LOG)
            } else {
                if (error.response.data.error=== "no_more_pages"){
                    noMoreUsers.current = true
                    setLoaderActivated(false)
                } else {
                    setLoadingState('Error inesperado cargando datos de usuarios!')
                }
            }
        }
    }

    const formatingFunction = (user)=>{
        return <UserButton key={v4()}user={user}onClickFunction={onClickEvent} withGlobe={chatGlobeList.includes(user.id)} />
    }
    const scrollDetector = async (event)=>{
        if ((event.target.scrollTop + event.target.clientHeight) >= event.target.scrollHeight){
            if (!noMoreUsers.current){
                await loadUsersList()
                userListPage.current += 1
            }
        } 
    }
    useEffect(()=>{
        setLoadingState(false)
        if (userIsAuthenticated() && usersList.length === 0){
            loadUsersList()
            userListPage.current = 2
        }
    }, [])
    useEffect(()=>{
        if (userKeyword !== undefined){ // si userKeyword esta inicializado ...
            userListPage.current = 1
            noMoreUsers.current = false
            loadUsersList()
        }
    }, [userKeyword])

    return (
        <>
            <div className="users-list">
                <UserFilter userList={usersList} userKeyword={userKeyword} userKeywordSetter={setUserKeyword} />
                {usersList.length > 0 ? 
                    <div className="users-list-container"  onScroll={scrollDetector}>
                        {usersList.map(formatingFunction)}
                    </div>
                    :
                    <div className="no-users-msg">
                        No se han encontrado usuarios
                    </div>
                }
                <div className={loaderActivated ? loaderClassName+"__activated" : loaderClassName}>
                    {loaderActivated && "Cargando ..."}
                </div>
            </div>
        </>
    )
}


UsersList.propTypes = {
    onClickEvent : PropTypes.func.isRequired,
}


