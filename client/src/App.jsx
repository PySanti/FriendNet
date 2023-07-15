import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Home} from "./pages/Home.jsx"
import { Login } from "./pages/Login.jsx"
import { Root } from "./pages/Root.jsx"
import { SignUp } from "./pages/SignUp.jsx"
import { AccountActivation } from "./pages/AccountActivation.jsx"
import { AuthContextProvider } from "./context/AuthContext.jsx"
import { Profile } from "./pages/Profile.jsx"
import {  LoadingContextProvider } from "./context/LoadingContext.jsx"
import { ChangePwd } from "./pages/ChangePwd.jsx"

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
          path="/login/"             
          element={ 
            <LoadingContextProvider>
              <AuthContextProvider> 
                <Login/> 
              </AuthContextProvider>
            </LoadingContextProvider>
          }/>
        <Route 
          exact 
          path='/home/'              
          element={
          <LoadingContextProvider>
            <AuthContextProvider> 
              <Home/> 
            </AuthContextProvider>
          </LoadingContextProvider>
          }/>
        <Route 
          exact 
          path='/home/profile/'      
          element={
            <LoadingContextProvider>
              <AuthContextProvider> 
                <Profile/> 
              </AuthContextProvider>
            </LoadingContextProvider>
          }/>
        <Route 
          exact 
          path='/home/profile/edit'  
          element={
            <LoadingContextProvider>
              <AuthContextProvider> 
                <Profile updating/> 
              </AuthContextProvider>
            </LoadingContextProvider>
          }/>
        <Route 
          exact 
          path='/home/profile/change_pwd'  
          element={
            <LoadingContextProvider>
              <AuthContextProvider> 
                <ChangePwd/> 
              </AuthContextProvider>
            </LoadingContextProvider>
          }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App