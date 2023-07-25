import axios from "axios"
/**
 * Recibe el public id de una imagen subida a cloudinary y la elimina llamando a su api
 * @param {String} publicImageId
 */
export async function removeCloudinaryAPI(publicImageId){
    return await axios.delete("https://api.cloudinary.com/v1_1/dwcabo8hs/image/destroy", {
        auth : {
            username : "297938727737734",
            password : "-VWtXXzApndOKxBUeyeoYb62Frs"
        }, 
        params : {
            public_id : publicImageId
        }
    })
}