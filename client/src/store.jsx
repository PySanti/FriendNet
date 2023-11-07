import create from "zustand"


export const useUsersList = create((set)=>({
    usersList : [],
    setUsersList : (newUsersList)=>(set(()=>({usersList : newUsersList})))
}))


export const useUsersIdList = create((set)=>({
    usersIdList : [], 
    setUsersIdList : (usersIdList) => set(() => ({usersIdList : usersIdList}))
}))


export const useUsersListPage = create((set)=>({
    usersListPage : 1,
    setUsersListPage : (newUsersListPage)=>(set(()=>({usersListPage : newUsersListPage})))
}))



export const useTemporaryUserData = create((set)=>({
    temporaryUserData : [],
    setTemporaryUserData : (newTemporaryUserData)=>(set(()=>({temporaryUserData : newTemporaryUserData})))
}))



export const useNotifications = create((set)=>({
    notifications : [],
    setNotifications : (newNotifications)=>(set(()=>({notifications : newNotifications})))
}))



export const useNoMoreUsers = create((set)=>({
    noMoreUsers : false,
    setNoMoreUsers : (newNoMoreUsers)=>(set(()=>({noMoreUsers : newNoMoreUsers})))
}))


export const useNotificationsIdsCached = create((set)=>({
    notificationsIdsCached : false,
    setNotificationsIdsCached : (notificationsIdsCached)=>(set(()=>({notificationsIdsCached : notificationsIdsCached})))
}))


export const useMessagesHistorial = create((set)=>({
    messagesHistorial : [],
    setMessagesHistorial : (newMessages)=>(set(()=>({messagesHistorial : newMessages})))
}))


export const useLoadingState = create((set)=>({
    loadingState : null,
    setLoadingState : (newState)=>(set(()=>({loadingState : newState}))),
    successfullyLoaded : ()=>(set(()=>({loadingState : "success"}))),
    startLoading : ()=>(set(()=>({loadingState : "loading"}))),
}))


export const useLastClickedUser = create((set)=>({
    lastClickedUser : null,
    setLastClickedUser : (newLastClicked)=>(set(()=>({lastClickedUser : newLastClicked})))
}))

export const useClickedUser = create((set)=>({
    clickedUser : null, 
    setClickedUser : (user) => set(() => ({clickedUser : user}))
}))

export const useChatGlobeList = create((set)=>({
    chatGlobeList : [],
    setChatGlobeList : (newChatGlobeList)=>(set(()=>({chatGlobeList : newChatGlobeList})))
}))
