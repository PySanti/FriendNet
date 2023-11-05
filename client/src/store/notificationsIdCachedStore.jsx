import create from "zustand"


export const useNotificationsIdsCached = create((set)=>({
    notificationsIdsCached : [],
    setNotificationsIdsCached : (notificationsIdsCached)=>(set(()=>({notificationsIdsCached : notificationsIdsCached})))
}))
