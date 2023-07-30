/**
 * Retorna true en caso de que la cadena pasada sea un link
 * @param image sera una imagen que podria ser o null, o un archivo o una imagen formateada
 */
export function isFormatedImage(image){
    return (typeof image === "object") && (image.cloudName)
}