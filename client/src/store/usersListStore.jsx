import create from "zustand"


export const useUsersList = create((set)=>({
    usersList : [],
    setUsersList : (newUsersList)=>(set(()=>({usersList : newUsersList})))
}))
