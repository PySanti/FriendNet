import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Home} from "./pages/Home.jsx"
import { Login } from "./pages/Login.jsx"
import { Root } from "./pages/Root.jsx"
import { SignUp } from "./pages/SignUp.jsx"
import { AccountActivation } from "./pages/AccountActivation.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Root />}/>
        <Route exact path="signup/" element={<SignUp />}/>
        <Route exact path="signup/activate/:userActivationCode" element={<AccountActivation />}/>
        <Route exact path="login/" element={<Login />}/>
        <Route exact path="home/" element={<Home />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App