import create from "zustand"

export const useAppMounted = create((set)=>({
    appMounted : [],
    setAppMounted : (appMounted)=>(set(()=>({appMounted : appMounted})))
}))
