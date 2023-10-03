import create from "zustand"

export const useLoadingState = create((set)=>({
    loadingState : null,
    setLoadingState : (newState)=>(set(()=>({loadingState : newState}))),
    successfullyLoaded : ()=>(set(()=>({loadingState : "success"}))),
    startLoading : ()=>(set(()=>({loadingState : "loading"}))),
}))
