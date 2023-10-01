import create from "zustand"

export const useClickedUser = create((set)=>({
    clickedUser : {
        id : null,
        username : null,
        photo_link : null,
        is_online : null
    }, 
    setClickedUser : (user) => set(() => ({clickedUser : user}))
}))