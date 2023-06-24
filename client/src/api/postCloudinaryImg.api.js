import axios from 'axios'

export async function postCloudinaryImgAPI(img){
    try{
        const formData = new FormData()
        formData.append("file", img[0])
        formData.append("upload_preset", "hlcir5x7")
        const uploadedImgData = await axios.post("https://api.cloudinary.com/v1_1/dwcabo8hs/image/upload", formData)
        return uploadedImgData
    } catch (error){
        console.log('Error subiendo imagen a cloudinary')
        console.log(error)
    }

}