import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { userIsAuthenticated } from "../tools/userIsAuthenticated";
import { UserNotLogged } from "./UserNotLogged";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserDetailAPI } from "../api/getUserDetailApi.api";
import { FormatedUserData } from "../components/FormatedUserData";
import { UnExpectedError } from "../components/UnExpectedError";
import { Loading } from "../components/Loading";
import { SubmitStateContext } from "../context/SubmitStateContext";


export function Profile(){
    let [backToHome, setBackToHome] = useState(false)
    let {loading, unExpectedError, handleUnExpectedError, startLoading, setLoading} = useContext(SubmitStateContext)
    const props = useLocation().state
    const {user} = useContext(AuthContext)
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)
    const [editProfile, setEditProfile] = useState(false)
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
    useEffect(()=>{
        if (backToHome){
            navigate('/home/')
        }
    }, [backToHome])
    useEffect(()=>{
        if (userIsAuthenticated()){
            startLoading()
            loadUserData()
            setLoading(false)
        }
    }, [])
    useEffect(()=>{
        if (editProfile){
            navigate('/home/profile/edit', {state:{userData}})
        }
    }, [editProfile])
    if (!userIsAuthenticated()){
        return <UserNotLogged/>
    } else{
        return ( 
            <>
                <Header username={user.username} msg="Viendo perfil"/>
                {unExpectedError && <UnExpectedError message={unExpectedError}/>}
                {loading && <Loading/>}
                <div className="user-data-container">
                    <img href={userData.photo_link} />
                    <FormatedUserData userData={userData}/>
                </div>
                <button onClick={()=>setEditProfile(true)}>editar perfil</button>
                <button onClick={()=>setBackToHome(true)}>Volver</button>
            </>
        )
    } 
}