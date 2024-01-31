import {toast} from "sonner"
import {executeApi} from "./executeApi"

/**
 * Wrapper del executeApi para implementacion de toast.loading
 */
export async function toastedApiCall(apiCallingFunction, navigateFunc, loadingMsg){
    const toastId = toast.loading(loadingMsg)
    const response = await executeApi(apiCallingFunction, navigateFunc)
    toast.dismiss(toastId)
    return response
}