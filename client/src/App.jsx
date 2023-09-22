import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Home} from "./pages/Home.jsx"
import { Login } from "./pages/Login.jsx"
import { Root } from "./pages/Root.jsx"
import { SignUp } from "./pages/SignUp.jsx"
import { AccountActivation } from "./pages/AccountActivation.jsx"
import { Profile } from "./pages/Profile.jsx"
import {  LoadingContextProvider } from "./context/LoadingContext.jsx"
import { ChangePwd } from "./pages/ChangePwd.jsx"
import { ChangeEmailForActivation } from "./pages/ChangeEmailForActivation.jsx"
import {useEffect} from "react"
import {disconnectWebsocket} from "./utils/disconnectWebsocket"
import {NOTIFICATIONS_WEBSOCKET} from "./utils/constants"
function App() {
  useEffect(()=>{
    return ()=>{
      disconnectWebsocket(NOTIFICATIONS_WEBSOCKET)
      localStorage.clear()
    }
  }, [])
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
          <LoadingContextProvider>
            <SignUp />
          </LoadingContextProvider>
          }/>
        <Route 
          exact 
          path="/signup/activate/"   
          element={
          <LoadingContextProvider>
            <AccountActivation />
          </LoadingContextProvider>
          }/>
        <Route 
          exact 
          path='/signup/activate/change_email'  
          element={
            <LoadingContextProvider>
              <ChangeEmailForActivation/> 
            </LoadingContextProvider>
          }/>
        <Route 
          exact 
          path="/login/"             
          element={ 
            <LoadingContextProvider>
              <Login/> 
            </LoadingContextProvider>
          }/>
        <Route 
          exact 
          path='/home/'              
          element={
          <LoadingContextProvider>
            <Home/> 
          </LoadingContextProvider>
          }/>
        <Route 
          exact 
          path='/home/profile/'      
          element={
            <LoadingContextProvider>
              <Profile/> 
            </LoadingContextProvider>
          }/>
        <Route 
          exact 
          path='/home/profile/edit'  
          element={
            <LoadingContextProvider>
              <Profile edit/> 
            </LoadingContextProvider>
          }/>
        <Route 
          exact 
          path='/home/profile/change_pwd'  
          element={
            <LoadingContextProvider>
              <ChangePwd/> 
            </LoadingContextProvider>
          }/>

      </Routes>
    </BrowserRouter>
  )
}

export default App