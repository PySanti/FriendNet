import create from "zustand"


export const useNotificationsIdsCached = create((set)=>({
    notificationsIdsCached : false,
    setNotificationsIdsCached : (notificationsIdsCached)=>(set(()=>({notificationsIdsCached : notificationsIdsCached})))
}))
