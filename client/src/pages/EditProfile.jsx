import { useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { UserDataForm } from "../components/UserDataForm";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserDetailAPI } from "../api/getUserDetailApi.api";
import { AuthContext } from "../context/AuthContext";

export function EditProfile(){
    const props  = useLocation().state
    const {user} = useContext(AuthContext)
    let [userData, setUserData] = useState(null)
    let [backToProfile, setBackToProfile] = useState(false)
    const [unExpectedError, setUnExpectedError] = useState(null)
    const navigate = useNavigate()
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
    const onUpdate = (data)=>{
    }
    useEffect(()=>{
        if(backToProfile){
            navigate('/home/profile/', {state : {userData:userData}})
        }
    }, [backToProfile])
    useEffect(()=>{
        if (userIsAuthenticated()){
            loadUserData()
        }
    }, [])
    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else if (userData){
        return <>
            <Header username={userData.username}msg="Editando perfil"/>
            <div className="un-expected-error-container">
                {unExpectedError && unExpectedError}
            </div>
            <div className="editing-container">
                <img href={userData.photo_link}/>
                <UserDataForm updating={true} method="PUT" onSubmitFunction={onUpdate} userData={userData}/> 
            </div>
            <button onClick={()=>setBackToProfile(true)}>
                Volver
            </button>
        </>
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