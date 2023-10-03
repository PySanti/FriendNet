import create from "zustand"
import {getNotificationsFromLocalStorage} from "../utils/getNotificationsFromLocalStorage"


export const useNotifications = create((set)=>({
    notifications : getNotificationsFromLocalStorage(),
    setNotifications : (newNotifications)=>(set(()=>({notifications : newNotifications})))
}))
