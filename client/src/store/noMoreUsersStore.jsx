import create from "zustand"


export const useNoMoreUsers = create((set)=>({
    noMoreUsers : false,
    setNoMoreUsers : (newNoMoreUsers)=>(set(()=>({noMoreUsers : newNoMoreUsers})))
}))
