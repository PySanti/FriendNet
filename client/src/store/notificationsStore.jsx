import create from "zustand"


export const useNotifications = create((set)=>({
    notifications : [],
    setNotifications : (newNotifications)=>(set(()=>({notifications : newNotifications})))
}))
