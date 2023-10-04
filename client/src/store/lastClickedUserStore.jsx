import create from "zustand"

export const useLastClickedUser = create((set)=>({
    lastClickedUser : null,
    setLastClickedUser : (newLastClicked)=>(set(()=>({lastClickedUser : newLastClicked})))
}))
