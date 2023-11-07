import create from "zustand"


export const useUsersListPage = create((set)=>({
    usersListPage : 1,
    setUsersListPage : (newUsersListPage)=>(set(()=>({usersListPage : newUsersListPage})))
}))
