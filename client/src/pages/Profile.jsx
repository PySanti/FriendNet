import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserDetailAPI } from "../api/getUserDetailApi.api";
import { UserData } from "../components/UserData";


export function Profile(){
    let [backToHome, setBackToHome] = useState(false)
    const props = useLocation().state
    const {user} = useContext(AuthContext)
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)
    const [unExpectedError, setUnExpectedError] = useState(null)
    const [editProfile, setEditProfile] = useState(false)
    const loadUserData = async ()=>{
        if (!props){
            try{
                const response = await getUserDetailAPI(user.username)
                setUserData(await response.data)
            } catch(error){
                setUnExpectedError("Error inesperado en repuesta de api userDetail!")
            }
        } else {
            setUserData(props.userData)
        }
    }
    useEffect(()=>{
        if (backToHome){
            navigate('/home/')
        }
    }, [backToHome])
    useEffect(()=>{
        if (userIsAuthenticated()){
            loadUserData()
        }
    }, [])
    useEffect(()=>{
        if (editProfile){
            navigate('/home/profile/edit', {state:{userData}})
        }
    }, [editProfile])
    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else if (userData){
        return ( 
            <>
                <Header username={user.username} msg="Viendo perfil"/>
                <button onClick={()=>setBackToHome(true)}>Volver</button>
                <div className="un-expected-error-container">
                    {unExpectedError && unExpectedError}
                </div>
                <div className="user-data-container">
                    <img href={userData.photo_link}/>
                    {userData && <UserData userData={userData}/>}
                </div>
                <button onClick={()=>setEditProfile(true)}>
                    editar perfil
                </button>
            </>
        )
    } else {
        return (
            <>
                <Header username={user.username}/>
                <h2>
                    Cargando datos del usuario
                </h2>
            </>
        )
    }
}