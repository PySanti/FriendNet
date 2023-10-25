import { UserButton } from "./UserButton"
import "../styles/UsersList.css"
import { v4 } from "uuid"
import { UserFilter } from "./UserFilter"
import {useState, useEffect, useRef} from "react"
import { getUsersListAPI } from "../api/getUsersList.api"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import {useLoadingState} from "../store/loadingStateStore"
import {BASE_UNEXPECTED_ERROR_LOG} from "../utils/constants"
import {handleStandardApiErrors} from "../utils/handleStandardApiErrors"
import {useUsersList} from "../store/usersListStore"

/**
 * Recibe la lista de usuarios directa de la api y retorna la lista de elementos jsx
 */
export function UsersList(){
    const loaderClassName                                           ="users-list-loader" 
    const  setLoadingState                                          = useLoadingState((state)=>(state.setLoadingState))
    let userListPage                                                = useRef(1)
    let noMoreUsers                                                 = useRef(false)
    let [loaderActivated, setLoaderActivated]                       = useState(true)
    let [usersList, setUsersList]                                   = useUsersList((state)=>([state.usersList, state.setUsersList]))
    let [ userKeyword, setUserKeyword]                              = useState(undefined)
    let [scrollDetectorBlock, setScrollDetectorBlock]               = useState(false)

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
            try {                
                if (error.response.data.error=== "no_more_pages"){
                    noMoreUsers.current = true
                    setLoaderActivated(false)
                } else {
                    handleStandardApiErrors(error.response, setLoadingState, "Ha habido un error cargando la lista de usuarios !")
                }
            } catch(error){
                setLoadingState(BASE_UNEXPECTED_ERROR_LOG)
            }
        }
    }
    const formatingFunction = (user)=>{
        return <UserButton key={v4()}user={user}  />
    }
    const scrollDetector = async (event)=>{
        if (((event.target.scrollTop + event.target.clientHeight) >= event.target.scrollHeight) && (!scrollDetectorBlock)){
            if (!noMoreUsers.current){
                setScrollDetectorBlock(true)
                setTimeout(() => {
                    setScrollDetectorBlock(false)
                }, 1000);
                await loadUsersList()
                userListPage.current += 1
            }
        } 
    }
    useEffect(()=>{
        setLoadingState(false)
        if (userIsAuthenticated() && usersList.length === 0){
            (async function() {
                await loadUsersList()
                userListPage.current = 2
            })()
        }
    }, [])
    useEffect(()=>{
        if (userKeyword !== undefined){ // si userKeyword esta inicializado ...
            (async function(){
                userListPage.current = 1
                noMoreUsers.current = false
                await loadUsersList()
            })()
        }
    }, [userKeyword])

    return (
        <>
            <div className="users-list">
                <UserFilter userKeyword={userKeyword} userKeywordSetter={setUserKeyword} />
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

