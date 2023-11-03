import { UserButton } from "./UserButton"
import "../styles/UsersList.css"
import { v4 } from "uuid"
import { UserFilter } from "./UserFilter"
import {useState, useEffect, useRef} from "react"
import { getUsersListAPI } from "../api/getUsersList.api"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import {useLoadingState} from "../store/loadingStateStore"
import {useUsersList} from "../store/usersListStore"
import {executeApi} from "../utils/executeApi"
import {useNavigate} from "react-router-dom"
/**
 * Recibe la lista de usuarios directa de la api y retorna la lista de elementos jsx
 */
export function UsersList(){
    const loaderClassName                                           ="users-list-loader" 
    const  setLoadingState                                          = useLoadingState((state)=>(state.setLoadingState))
    let userListPage                                                = useRef(1)
    let noMoreUsers                                                 = useRef(false)
    let [loaderActivated, setLoaderActivated]                       = useState(false)
    let [usersList, setUsersList]                                   = useUsersList((state)=>([state.usersList, state.setUsersList]))
    let [ userKeyword, setUserKeyword]                              = useState(undefined)
    let [scrollDetectorBlock, setScrollDetectorBlock]               = useState(false)
    const navigate = useNavigate()
    const canChargeUsersList = (event)=>{
        return ((event.target.scrollTop + event.target.clientHeight) >= event.target.scrollHeight) && (!scrollDetectorBlock) && (!noMoreUsers.current)
    }
    const updateScrollDetectorBlock = ()=>{
        setScrollDetectorBlock(true)
        setTimeout(() => {
            setScrollDetectorBlock(false)
        }, 1000);
    }
    const loadUsersList = async ()=>{
        if (userListPage.current > 1 ){
            setLoaderActivated(true)
        }
        const response = executeApi(async ()=>{
            return await getUsersListAPI(!userKeyword || userKeyword.length === 0 ? undefined : userKeyword, getUserDataFromLocalStorage().id, userListPage.current)
        }, navigate,setLoadingState )
        if (response){
            if (response.status == 200){
                setUsersList(userListPage.current === 1 ? response.data.users_list : usersList.concat(response.data.users_list))
            } else if (response.status == 400){
                if (response.data.error=== "no_more_pages"){
                    noMoreUsers.current = true
                } else {
                    setLoaderActivated("Ha habido un error cargando la lista de usuarios !")
                }
            }
        }
        setLoaderActivated(false)
    }
    const formatingFunction = (user)=>{
        return <UserButton key={v4()}user={user}  />
    }
    const scrollDetector = async (event)=>{
        if (canChargeUsersList(event)){
            updateScrollDetectorBlock()
            await loadUsersList()
            userListPage.current += 1
        }
    }
    useEffect(()=>{
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

