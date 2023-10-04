import create from "zustand"
export const useChatGlobeList = create((set)=>({
    chatGlobeList : [],
    setChatGlobeList : (newChatGlobeList)=>(set(()=>({chatGlobeList : newChatGlobeList})))
}))
