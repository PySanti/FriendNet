import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Toaster, toast} from "sonner"
import {Home} from "./pages/Home.jsx"
import { Login } from "./pages/Login.jsx"
import { Root } from "./pages/Root.jsx"
import { SignUp } from "./pages/SignUp.jsx"
import {ForgotPasswordPage} from "./pages/ForgotPasswordPage"
import { AccountActivation } from "./pages/AccountActivation.jsx"
import { Profile } from "./pages/Profile.jsx"
import { ChangePwd } from "./pages/ChangePwd.jsx"
import { ChangeEmailForActivation } from "./pages/ChangeEmailForActivation.jsx"
import {useEffect} from "react"
import {NOTIFICATIONS_WEBSOCKET} from "./utils/constants"
import {getUserDataFromLocalStorage} from "./utils/getUserDataFromLocalStorage"
import {NotificationsWSCanBeUpdated} from "./utils/NotificationsWSCanBeUpdated"
import {saveNotificationsInLocalStorage} from "./utils/saveNotificationsInLocalStorage"
import {logoutUser} from "./utils/logoutUser"
import {Page404} from "./pages/Page404"
import {shiftUser} from "./utils/shiftUser"
import * as states from "./store"
import {initStates} from "./utils/initStates"
import alert from "./sounds/alert.mp3"
import {DarkModeButton} from "./components/DarkModeButton"

/**
/**
 * Toda la implementacion que tenemos del websocket de notificaciones en el app.jsx
 * es para poder agregar un soporte basico para recepcion de mensajes en el websocket
 * mientras el Home no se monta ...
 */

function App() {
  let [notifications, setNotifications] = states.useNotifications((state)=>([state.notifications, state.setNotifications]))
  let [usersList, setUsersList]         = states.useUsersList((state)=>([state.usersList, state.setUsersList]))
  let [typingDB, setTypingDB]           = states.useTypingDB((state)=>[state.typingDB, state.setTypingDB])
  let [clickedUser, setClickedUser]     = states.useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
  let setLastClickedUser                = states.useLastClickedUser((state)=>(state.setLastClickedUser))
  let [usersIdList, setUsersIdList]     = states.useUsersIdList((state)=>[state.usersIdList, state.setUsersIdList])
  let setExecutingInSmallDevice         = states.useExecutingInSmallDevice((state)=>(state.setExecutingInSmallDevice))
  let userKeyword                       = states.useUserKeyword((state)=>(state.userKeyword))
  const audioEffect = ()=>{
    const alertAudio = new Audio(alert)
    alertAudio.volume = 0.2
    alertAudio.play()
  }
  useEffect(()=>{
    if (window.innerWidth <= 800){
      setExecutingInSmallDevice(true)
    }
    initStates(notifications, setNotifications)
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      console.log('Navegador en modo obscuro')
    } 
  }, [])


  useEffect(()=>{
    if (NotificationsWSCanBeUpdated()){
      NOTIFICATIONS_WEBSOCKET.current.onmessage = (event)=>{
        const data = JSON.parse(event.data)
        console.log(data)
        if (data.type == "new_notification"){
            if (data.value.new_notification.sender_user.id != getUserDataFromLocalStorage().id){
              audioEffect()
              const message = data.value.new_notification.message
              delete data.value.new_notification.message
              notifications[data.value.new_notification.sender_user.id] = data.value.new_notification
              toast(data.value.new_notification.sender_user.username, {
                description:message.length > 20? `${message.substring(0,20)}...` : message,
              })
              setNotifications(notifications)
              saveNotificationsInLocalStorage(notifications)
              shiftUser(usersList, setUsersList, data.value.new_notification.sender_user, usersIdList, setUsersIdList, userKeyword)
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
            typingDB[data.value.user_id] = data.value.typing
            setTypingDB(typingDB)
          }
        }
      }
    }
  }, [notifications, usersList, clickedUser])


  return (
    <>
    <Toaster 
      position="bottom-right"
      closeButton
      toastOptions={{
      className : "toast-style",
      duration : 5000,
    }}/>
    <DarkModeButton/>
    <BrowserRouter>
      <Routes>
        <Route 
          exact 
          path="/"                   
          element={
            <Root />
        }/>
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
          path="/login/forgot_password"             
          element={ 
              <ForgotPasswordPage/> 
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
  </>
  )
}

export default App