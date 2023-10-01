import create from "zustand"

export const useClickedUser = create((set)=>({
    clickedUser : {
        id : null,
        username : null,
        photo_link : null
    }, 
    setClickedUser : (user) => set(() => ({clickedUser : user}))
}))