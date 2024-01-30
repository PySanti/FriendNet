import create from "zustand"


export const useUsersList = create((set)=>({
    usersList : [],
    setUsersList : (newUsersList)=>(set(()=>({usersList : newUsersList}))),
    reset : ()=>(set(()=>({usersList : []})))
}))


export const useUsersIdList = create((set)=>({
    usersIdList : [], 
    setUsersIdList : (usersIdList) => set(() => ({usersIdList : usersIdList})),
    reset : ()=>(set(()=>({usersIdList : []})))
}))


export const useUsersListPage = create((set)=>({
    usersListPage : 1,
    setUsersListPage : (newUsersListPage)=>(set(()=>({usersListPage : newUsersListPage}))),
    reset : ()=>(set(()=>({usersListPage : 1})))
}))




export const useNotifications = create((set)=>({
    notifications : {},
    setNotifications : (newNotifications)=>(set(()=>({notifications : newNotifications}))),
    reset : ()=>(set(()=>({notifications : {}})))
}))



export const useNoMoreUsers = create((set)=>({
    noMoreUsers : false,
    setNoMoreUsers : (newNoMoreUsers)=>(set(()=>({noMoreUsers : newNoMoreUsers}))),
    reset : ()=>(set(()=>({noMoreUsers : false})))
}))



export const useMessagesHistorial = create((set)=>({
    messagesHistorial : [],
    setMessagesHistorial : (newMessages)=>(set(()=>({messagesHistorial : newMessages}))),
    reset : ()=>(set(()=>({messagesHistorial : []})))
}))


export const useLastClickedUser = create((set)=>({
    lastClickedUser : null,
    setLastClickedUser : (newLastClicked)=>(set(()=>({lastClickedUser : newLastClicked}))),
    reset : ()=>(set(()=>({lastClickedUser : null})))
}))

export const useClickedUser = create((set)=>({
    clickedUser : null, 
    setClickedUser : (user) => set(() => ({clickedUser : user})),
    reset : ()=>(set(()=>({clickedUser : null})))
}))

export const useFirstUsersListCall = create((set)=>({
    firstUsersListCall : false,
    setFirstUsersListCall : (new_val)=>(set(()=>({firstUsersListCall : new_val}))),
    reset : ()=>(set(()=>({firstUsersListCall: false})))
}))

export const useDarkMode = create((set)=>({
    darkModeActivated : false,
    setDarkModeActivated : (new_val)=>(set(()=>({darkModeActivated : new_val}))),
}))


export const useUserKeyword = create((set)=>({
    userKeyword : null,
    setUserKeyword : (new_val)=>(set(()=>({userKeyword : new_val}))),
    reset : ()=>(set(()=>({userKeyword: null})))
}))

export const useUserFilterInput = create((set)=>({
    userFilterInput : null,
    setUserFilterInput: (new_val)=>(set(()=>({userFilterInput : new_val}))),
    reset : ()=>(set(()=>({userFilterInput: null})))
}))



export const useTypingDB = create((set)=>({
    typingDB : {},
    setTypingDB : (new_val)=>(set(()=>({typingDB : new_val}))),
    reset : ()=>(set(()=>({typingDB: {}})))
}))






