import axios from 'axios'

export async function postCloudinaryImgAPI(img){
    const formData = new FormData()
    formData.append("file", img[0])
    formData.append("upload_preset", "hlcir5x7")
    return await axios.post("https://api.cloudinary.com/v1_1/dwcabo8hs/image/upload", formData)
}