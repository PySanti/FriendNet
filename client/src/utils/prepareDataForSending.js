import { saveCloudinary } from "../utils/saveCloudinary";
import { checkImageFormat } from "../utils/checkImageFormat";
/**
 * Recibira un objeto con los datos recibidos en SignUp.jsx y Profile.jsx y lo retornara "preparado"
 * para su envio. Esta funcion modificara el objeto data por referencia, retornara true en caso de que
 * todo haya salido bien y un mensaje de error en caso de que no
 * @param {Object} data 
 * @param {String} type tipo de envio que se esta realizando 
 */
export async function prepareDataForSending(data, type){
    if (type === "register"){
        let imageCheckerResponse = true
        if (data['photo']){
            imageCheckerResponse = checkImageFormat(data['photo'][0])
            if (imageCheckerResponse === true){
                data['photo_link'] =  await saveCloudinary(data['photo']) 
            } else{
                return imageCheckerResponse
            }
        } else {
            data['photo_link'] = null
        }
        delete data.confirmPwd // el confirmPwd no puede ser enviado al backend
        delete data.photo
        return true
    } 
}