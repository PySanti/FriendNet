import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Home} from "./pages/Home.jsx"
import { Login } from "./pages/Login.jsx"
import { Root } from "./pages/Root.jsx"
import { SignUp } from "./pages/SignUp.jsx"
import { AccountActivation } from "./pages/AccountActivation.jsx"
import { AuthContextProvider } from "./context/AuthContext.jsx"
import { Profile } from "./pages/Profile.jsx"
import { EditProfile } from "./pages/EditProfile.jsx"
import { SubmitStateContext, SubmitStateContextProvider } from "./context/SubmitStateContext.jsx"
import { ProfileContextProvider } from "./context/ProfileContext.jsx"

function App() {
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
          <SubmitStateContextProvider>
            <SignUp />
          </SubmitStateContextProvider>
          }/>
        <Route 
          exact 
          path="/signup/activate/"   
          element={
          <SubmitStateContextProvider>
            <AccountActivation />
          </SubmitStateContextProvider>
          }/>
        <Route 
          exact 
          path="/login/"             
          element={ 
            <SubmitStateContextProvider>
              <AuthContextProvider> 
                <Login/> 
              </AuthContextProvider>
            </SubmitStateContextProvider>
          }/>
        <Route 
          exact 
          path='/home/'              
          element={<AuthContextProvider> <Home/> </AuthContextProvider>}/>
        <Route 
          exact 
          path='/home/profile/'      
          element={
          <ProfileContextProvider>
            <SubmitStateContextProvider>
              <AuthContextProvider> 
                <Profile/> 
              </AuthContextProvider>
            </SubmitStateContextProvider>
          </ProfileContextProvider>
          }/>
        <Route 
          exact 
          path='/home/profile/edit'  
          element={
          <ProfileContextProvider>
            <SubmitStateContextProvider>
              <AuthContextProvider> 
                <EditProfile/> 
              </AuthContextProvider>
            </SubmitStateContextProvider>
          </ProfileContextProvider>
          }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App