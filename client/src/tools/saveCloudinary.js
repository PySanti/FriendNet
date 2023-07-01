import { postCloudinaryImgAPI } from "../api/postCloudinaryImg.api";

export async function saveCloudinary(photo){
    /**
     * Almacena foto en cloudinary, retorna la url de la imagen
     */
    const uploadedImgData           = await postCloudinaryImgAPI(photo)
    return uploadedImgData.data.url
}