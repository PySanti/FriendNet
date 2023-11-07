import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Home} from "./pages/Home.jsx"
import { Login } from "./pages/Login.jsx"
import { Root } from "./pages/Root.jsx"
import { SignUp } from "./pages/SignUp.jsx"
import { AccountActivation } from "./pages/AccountActivation.jsx"
import { Profile } from "./pages/Profile.jsx"
import { ChangePwd } from "./pages/ChangePwd.jsx"
import { ChangeEmailForActivation } from "./pages/ChangeEmailForActivation.jsx"
import {useEffect} from "react"
import {NOTIFICATIONS_WEBSOCKET} from "./utils/constants"
import {getUserDataFromLocalStorage} from "./utils/getUserDataFromLocalStorage"
import {NotificationsWSInitialize} from "./utils/NotificationsWSInitialize"
import {userIsAuthenticated} from "./utils/userIsAuthenticated"
import {useUsersList} from "./store"
import {useClickedUser} from "./store"
import {useLastClickedUser} from "./store"
import {useNotifications} from "./store"
import {NotificationsWSCanBeUpdated} from "./utils/NotificationsWSCanBeUpdated"
import {saveNotificationsInLocalStorage} from "./utils/saveNotificationsInLocalStorage"
import {logoutUser} from "./utils/logoutUser"
import {Page404} from "./pages/Page404"
import {useNotificationsIdsCached} from "./store"
import {shiftUser} from "./utils/shiftUser"
import {useUsersIdList} from "./store"
/**
/**
 * Toda la implementacion que tenemos del websocket de notificaciones en el app.jsx
 * es para poder agregar un soporte basico para recepcion de mensajes en el websocket
 * mientras el Home no se monta ...
 */

function App() {
  let [notifications, setNotifications] = useNotifications((state)=>([state.notifications, state.setNotifications]))
  let [usersList, setUsersList] = useUsersList((state)=>([state.usersList, state.setUsersList]))
  let [clickedUser, setClickedUser] = useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
  let setLastClickedUser = useLastClickedUser((state)=>(state.setLastClickedUser))
  let setNotificationsIdsCached = useNotificationsIdsCached((state)=>state.setNotificationsIdsCached)
  let [usersIdList, setUsersIdList] = useUsersIdList((state)=>[state.usersIdList, state.setUsersIdList])
  useEffect(()=>{
    if (!NOTIFICATIONS_WEBSOCKET.current && userIsAuthenticated()){
      NotificationsWSInitialize(getUserDataFromLocalStorage().id, setNotificationsIdsCached)
    }
  }, [])
  useEffect(()=>{
    if (NotificationsWSCanBeUpdated()){
      NOTIFICATIONS_WEBSOCKET.current.onmessage = (event)=>{
        const data = JSON.parse(event.data)
        console.log(data)
        if (data.type == "new_notification"){
            if (data.value.new_notification.sender_user.id != getUserDataFromLocalStorage().id){
                const updatedNotifications = [...notifications, data.value.new_notification]
                setNotifications(updatedNotifications)
                saveNotificationsInLocalStorage(updatedNotifications)
                shiftUser(usersList, setUsersList, data.value.new_notification.sender_user, usersIdList, setUsersIdList)
                }

        } else if (data.type == "connection_error"){
            logoutUser(undefined)
        } else  if (data.type === "updated_user"){
            if (usersList.length > 0){
                setUsersList(usersList.map(user => { 
                    return  user.id == data.value.id ? data.value : user;
                }))
                if (clickedUser && data.value.id == clickedUser.id){
                    setLastClickedUser(clickedUser)
                    data.value.is_online = clickedUser.is_online
                    setClickedUser(data.value)
                }
            }
        } else if (data.type === "typing_inform"){
          if (usersIdList.includes(data.value.user_id)){
            usersList.map((user)=>{
              if (user.id == data.value.user_id){
                user.is_typing = data.value.typing
              }
              return user
            })
            setUsersList(usersList)
          }
        }
      }
    }
  }, [notifications, usersList, clickedUser])
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          exact 
          path="/"                   
          element={<Root />}/>
        <Route 
          exact 
          path="/signup/"            
          element={
            <SignUp />
          }/>
        <Route 
          exact 
          path="/signup/activate/"   
          element={
            <AccountActivation />
          }/>
        <Route 
          exact 
          path='/signup/activate/change_email'  
          element={
              <ChangeEmailForActivation/> 
          }/>
        <Route 
          exact 
          path="/login/"             
          element={ 
              <Login/> 
          }/>
        <Route 
          exact 
          path='/home/'              
          element={
            <Home/> 
          }/>
        <Route 
          exact 
          path='/home/profile/'      
          element={
              <Profile/> 
          }/>
        <Route 
          exact 
          path='/home/profile/edit'  
          element={
              <Profile edit/> 
          }/>
        <Route 
          exact 
          path='/home/profile/change_pwd'  
          element={
              <ChangePwd/> 
          }/>
        <Route 
          exact 
          path='/*'  
          element={
              <Page404/> 
          }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App