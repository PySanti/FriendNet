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



export const useTemporaryUserData = create((set)=>({
    temporaryUserData : [],
    setTemporaryUserData : (newTemporaryUserData)=>(set(()=>({temporaryUserData : newTemporaryUserData}))),
    reset : ()=>(set(()=>({temporaryUserData : []})))
}))



export const useNotifications = create((set)=>({
    notifications : [],
    setNotifications : (newNotifications)=>(set(()=>({notifications : newNotifications}))),
    reset : ()=>(set(()=>({notifications : []})))
}))



export const useNoMoreUsers = create((set)=>({
    noMoreUsers : false,
    setNoMoreUsers : (newNoMoreUsers)=>(set(()=>({noMoreUsers : newNoMoreUsers}))),
    reset : ()=>(set(()=>({noMoreUsers : false})))
}))


export const useNotificationsIdsCached = create((set)=>({
    notificationsIdsCached : false,
    setNotificationsIdsCached : (notificationsIdsCached)=>(set(()=>({notificationsIdsCached : notificationsIdsCached}))),
    reset : ()=>(set(()=>({notificationsIdsCached : false})))
}))


export const useMessagesHistorial = create((set)=>({
    messagesHistorial : [],
    setMessagesHistorial : (newMessages)=>(set(()=>({messagesHistorial : newMessages}))),
    reset : ()=>(set(()=>({messagesHistorial : []})))
}))


export const useLoadingState = create((set)=>({
    loadingState : null,
    setLoadingState : (newState)=>(set(()=>({loadingState : newState}))),
    successfullyLoaded : ()=>(set(()=>({loadingState : "success"}))),
    startLoading : ()=>(set(()=>({loadingState : "loading"}))),
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

export const useChatGlobeList = create((set)=>({
    chatGlobeList : [],
    setChatGlobeList : (newChatGlobeList)=>(set(()=>({chatGlobeList : newChatGlobeList}))),
    reset : ()=>(set(()=>({clickedUser : []})))
}))
