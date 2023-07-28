/**
 * Recibe una imagen de cloudinary y retorna su public id
 */
export function getPublicId(ref){
    const splitted_ref = ref.split('/')
    return splitted_ref[splitted_ref.length-1].split('.')[0]
}