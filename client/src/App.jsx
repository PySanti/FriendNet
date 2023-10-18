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
import {useUsersList} from "./store/usersListStore"
import {useClickedUser} from "./store/clickedUserStore"
import {useLastClickedUser} from "./store/lastClickedUserStore"
import {NotificationsWSUpdate} from "./utils/NotificationsWSUpdate"
import {useNotifications} from "./store/notificationsStore"
import {NotificationsWSCanBeUpdated} from "./utils/NotificationsWSCanBeUpdated"


function App() {
  let [notifications, setNotifications] = useNotifications((state)=>([state.notifications, state.setNotifications]))
  let [usersList, setUsersList] = useUsersList((state)=>([state.usersList, state.setUsersList]))
  let [clickedUser, setClickedUser] = useClickedUser((state)=>([state.clickedUser, state.setClickedUser]))
  let setLastClickedUser = useLastClickedUser((state)=>(state.setLastClickedUser))
  useEffect(()=>{
    if (!NOTIFICATIONS_WEBSOCKET.current && userIsAuthenticated()){
      NotificationsWSInitialize(getUserDataFromLocalStorage().id)
    }
  }, [])
  useEffect(()=>{
    if (NotificationsWSCanBeUpdated()){
      NotificationsWSUpdate(notifications, setNotifications, undefined, setUsersList, usersList, clickedUser, setLastClickedUser, setClickedUser)
    }
  }, [notifications])

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

      </Routes>
    </BrowserRouter>
  )
}

export default App