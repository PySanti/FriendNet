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
        <Route path="/" element={<Root />}/>
        <Route path="signup/" element={<SignUp />}/>
        <Route path="signup/activate" element={<AccountActivation />}/>
        <Route path="login/" element={<Login />}/>
        <Route path="home/" element={<Home />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App