import create from "zustand"


export const useNotificationsWS = create((set)=>({
    notificationsWS: null,
    setNotificationsWS : (newNotificationWS)=>(set(()=>({notificationsWS : newNotificationWS})))
}))
