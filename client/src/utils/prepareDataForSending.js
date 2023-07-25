import { removeCloudinary } from "./removeCloudinary";
import { saveCloudinary } from "./saveCloudinary";
/**
 * Recibira un objeto con los datos recibidos en SignUp.jsx y Profile.jsx y lo retornara "preparado"
 * para su envio. Esta funcion modificara el objeto data por referencia, retornara true en caso de que
 * todo haya salido bien y un mensaje de error en caso de que no.
 * 
 * Pd: esta funcion solo debe ser llamada desde Profile y SignUp ya que esta creada especificamente para
 * estas paginas
 * @param {Object} data 
 * @param {String} type tipo de envio que se esta realizando 
 * @param {String} defaultPhotoLink valor que se le dara al photo_link en caso de que data['photo'] sea null
 */
export async function prepareDataForSending(data, type, defaultPhotoLink){
    if (type === "register"){
        delete data.confirmPwd // el confirmPwd no puede ser enviado al backend
    }
    if (data['photo']){
        if (type==="updating"){
            await removeCloudinary(defaultPhotoLink)
        }
        data['photo_link'] =  await saveCloudinary(data['photo']) 
    } else {
        data['photo_link'] = defaultPhotoLink
    }
    delete data.photo
    return true
}