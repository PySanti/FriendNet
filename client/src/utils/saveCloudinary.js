import { postCloudinaryImgAPI } from "../api/postCloudinaryImg.api";

/**
 * Almacena foto en cloudinary, retorna la url de la imagen
 * @param {File} photo 
 */
export async function saveCloudinary(photo){
    const uploadedImgData    = await postCloudinaryImgAPI(photo)
    return uploadedImgData.data.url
}