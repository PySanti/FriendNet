import { UserButton } from "./UserButton"
import "../styles/UsersList.css"
import { v4 } from "uuid"
import { UserFilter } from "./UserFilter"
import {useState, useEffect} from "react"
import { getUsersListAPI } from "../api/getUsersList.api"
import {getUserDataFromLocalStorage} from "../utils/getUserDataFromLocalStorage"
import { userIsAuthenticated } from "../utils/userIsAuthenticated"
import {useLoadingState} from "../store"
import {useUsersList} from "../store"
import {executeApi} from "../utils/executeApi"
import {useNavigate} from "react-router-dom"
import {useUsersIdList} from "../store"
import {useUsersListPage} from "../store"
import {useNoMoreUsers} from "../store"
import {useFirstUsersListCall} from "../store"
import {useNotificationsIdsCached} from "../store"
/**
 * Recibe la lista de usuarios directa de la api y retorna la lista de elementos jsx
 */
export function UsersList(){
    const loaderClassName                                           ="users-list-loader" 
    const  setLoadingState                                          = useLoadingState((state)=>(state.setLoadingState))
    let [usersListPage, setUsersListPage]                           = useUsersListPage((state)=>[state.usersListPage, state.setUsersListPage])
    let [noMoreUsers, setNoMoreUsers]                               = useNoMoreUsers((state)=>[state.noMoreUsers, state.setNoMoreUsers])
    let [loaderActivated, setLoaderActivated]                       = useState(false)
    let [usersIdList, setUsersIdList]                               = useUsersIdList((state)=>[state.usersIdList, state.setUsersIdList])
    let [usersList, setUsersList]                                   = useUsersList((state)=>([state.usersList, state.setUsersList]))
    let [ userKeyword, setUserKeyword]                              = useState(undefined)
    let [scrollDetectorBlock, setScrollDetectorBlock]               = useState(false)
    let [firstUsersListCall, setFirstUsersListCall]                 = useFirstUsersListCall((state)=>[state.firstUsersListCall, state.setFirstUsersListCall])
    let notificationsIdsCached                                      = useNotificationsIdsCached((state)=>state.notificationsIdsCached)
    const navigate = useNavigate()
    const canChargeUsersList = (event)=>{
        return ((event.target.scrollTop + event.target.clientHeight) >= event.target.scrollHeight) && (!scrollDetectorBlock) && (!noMoreUsers)
    }
    const updateScrollDetectorBlock = ()=>{
        setScrollDetectorBlock(true)
        setTimeout(() => {
            setScrollDetectorBlock(false)
        }, 1000);
    }
    const voidUserKeyword = ()=>{
        return !userKeyword || userKeyword.length == 0
    }
    const updateUsers = (new_users_list)=>{
        if (!voidUserKeyword() || voidUserKeyword() && usersListPage==1){
            setUsersIdList(new_users_list.map(user=>{
                return user.id
            }))
            setUsersList(new_users_list)
        } else {
            new_users_list.forEach(user => {        
                if (!usersIdList.includes(user.id)){
                    usersList.push(user)
                    usersIdList.push(user.id)
                } else {
                    console.log(`${user.username} ya esta en la lista, no se agregara`)
                }
            });
            console.log(usersIdList)
            setUsersIdList(usersIdList)
            setUsersList(usersList)
        }
    }
    const loadUsersList = async (page)=>{
        if (page > 1 ){
            setLoaderActivated(true)
        }
        const response = await executeApi(async ()=>{
            return await getUsersListAPI(voidUserKeyword() ? undefined : userKeyword, getUserDataFromLocalStorage().id, page)
        }, navigate,setLoadingState )
        if (response){
            if (response.status == 200){
                updateUsers(response.data.users_list)
            } else if (response.data.error=== "no_more_pages"){
                setNoMoreUsers(true)
            } else {
                setLoaderActivated("Ha habido un error cargando la lista de usuarios !")
            }
        }
        setLoaderActivated(false)
    }
    const formatingFunction = (user)=>{
        return <UserButton key={v4()}user={user}  />
    }
    useEffect(()=>{
        console.log(usersList)
    }, [usersList])
    const scrollDetector = async (event)=>{
        if (canChargeUsersList(event) && notificationsIdsCached){
            updateScrollDetectorBlock()
            await loadUsersList(usersListPage)
            setUsersListPage(usersListPage+1)
        }
    }
    useEffect(()=>{
        if (userIsAuthenticated()  && notificationsIdsCached && !firstUsersListCall){
            (async function() {
                console.log('Obteniendo primera pagina de la usersList')
                await loadUsersList(1)
                setUsersListPage(2)
                setFirstUsersListCall(true)
            })()
        }
    }, [notificationsIdsCached])
    useEffect(()=>{
        if (userKeyword !== undefined && notificationsIdsCached){ // si userKeyword esta inicializado ...
            (async function(){
                setNoMoreUsers(false)
                setUsersListPage(1)
                await loadUsersList(1)
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

