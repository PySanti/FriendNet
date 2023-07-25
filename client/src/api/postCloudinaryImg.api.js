import axios from 'axios'

/**
 * Llama a la api de Cloudinary para subir imagen
 * @param {File} img imagen a subir  
 * @returns {Promise} la promesa del servidor
 */
export async function postCloudinaryImgAPI(img){
    const formData = new FormData()
    formData.append("file", img[0])
    formData.append("upload_preset", "ml_default")
    return await axios.post("https://api.cloudinary.com/v1_1/dwcabo8hs/image/upload", formData, {
        auth : {
            username : "297938727737734",
            password : "-VWtXXzApndOKxBUeyeoYb62Frs"
        },
        headers : {
            'Content-Type': 'multipart/form-data'
        }
    })
}