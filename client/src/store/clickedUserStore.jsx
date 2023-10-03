import create from "zustand"

export const useClickedUser = create((set)=>({
    clickedUser : null, 
    setClickedUser : (user) => set(() => ({clickedUser : user}))
}))