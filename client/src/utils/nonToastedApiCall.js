import {toast} from "sonner"
import {executeApi} from "./executeApi"

// funcion creada como wrapper para llamadas a apis en las que se quiera renderizar un toast.loading
// despues de x cantidad de tiempo (timer)
export async function  nonToastedApiCall(apiCalling, navigateFunc, loadingMsg, timer){
    let resolved = false;
    let toastId = false;
    setTimeout(() => {
        if (!resolved){
            toastId = toast.loading(loadingMsg)
        }
    }, timer);

    const response = await executeApi(apiCalling, navigateFunc)

    resolved = true
    if (toastId)
        toast.dismiss(toastId)
    return response
}