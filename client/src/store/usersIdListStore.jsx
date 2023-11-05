import create from "zustand"

export const useUsersIdList = create((set)=>({
    usersIdList : [], 
    setUsersIdList : (usersIdList) => set(() => ({usersIdList : usersIdList}))
}))