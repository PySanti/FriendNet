/**
 * Recibe el link de una imagen de cloudinary y retorna su public id
 * @param {String} photoLink 
 */
export function getImagePublicId(photoLink){
    let image_id = photoLink.split('/')
    image_id = image_id[image_id.length-1].split('.')[0]
    return image_id
}