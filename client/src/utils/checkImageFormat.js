/**
 * Recibe una imagen y retorna true en caso de que sea valida, y un mensaje de error en caso de que no
 * @param {File} image
 */
export function checkImageFormat(image){
    const imageFormat = image.type.split('/')[1]
    if (!["jpg","jpeg", "png"].includes(imageFormat)){
        return "Error, formato de imagen no soportado !"
    } else {
        if (image.size/1000 > 500){
            return "Error, el peso de la imagen debe ser inferior a 500kb !"
        } else {
            return true
        }
    }

}