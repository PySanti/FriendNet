import create from "zustand"
import {getChatGlobesList} from "../utils/getChatGlobesList"
import {getNotificationsFromLocalStorage} from "../utils/getNotificationsFromLocalStorage"
export const useChatGlobeList = create((set)=>({
    chatGlobeList : [],
    setChatGlobeList : (newChatGlobeList)=>(set(()=>({chatGlobeList : newChatGlobeList})))
}))
