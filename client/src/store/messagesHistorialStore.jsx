import create from "zustand"

export const useMessagesHistorial = create((set)=>({
    messagesHistorial : [],
    setMessagesHistorial : (newMessages)=>(set(()=>({messagesHistorial : newMessages})))
}))
