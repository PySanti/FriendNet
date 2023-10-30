import create from "zustand"


export const useTemporaryUserData = create((set)=>({
    temporaryUserData : [],
    setTemporaryUserData : (newTemporaryUserData)=>(set(()=>({temporaryUserData : newTemporaryUserData})))
}))
