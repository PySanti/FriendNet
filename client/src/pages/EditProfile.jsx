import { useContext, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { UserForm } from "../components/UserForm";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserDetailAPI } from "../api/getUserDetailApi.api";
import { AuthContext } from "../context/AuthContext";
import { UnExpectedError } from "../components/UnExpectedError";
import { Loading } from "../components/Loading";
import { SubmitStateContext } from "../context/SubmitStateContext";

export function EditProfile(){
    let {loading, unExpectedError, handleUnExpectedError, startLoading, setLoading} = useContext(SubmitStateContext)
    const props  = useLocation().state
    const {user} = useContext(AuthContext)
    let [userData, setUserData] = useState(null)
    let [backToProfile, setBackToProfile] = useState(false)
    const navigate = useNavigate()
    const loadUserData = async ()=>{
        if (!props){
            try{
                const response = await getUserDetailAPI(user.username)
                setUserData(await response.data)
            } catch(error){
                handleUnExpectedError("Error inesperado en repuesta de api userDetail!")
            }
        } else {
            setUserData(props.userData)
        }
    }
    const onUpdate = (data)=>{
        startLoading(true)
        console.log('Actualizar')
    }
    useEffect(()=>{
        if(backToProfile){
            navigate('/home/profile/', {state : {userData:userData}})
        }
    }, [backToProfile])
    useEffect(()=>{
        if (userIsAuthenticated()){
            startLoading(true)
            loadUserData()
            setLoading(false)
        }
    }, [])
    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else{
        return <>
            <Header username={userData.username}msg="Editando perfil"/>
            {unExpectedError && <UnExpectedError/>}
            {loading && <Loading/>}
            <div className="editing-container">
                <img href={userData.photo_link}/>
                <UserForm updating={true}  onSubmitFunction={onUpdate} userData={userData}/> 
            </div>
            <button onClick={()=>setBackToProfile(true)}>Volver</button>
        </>
    }
}