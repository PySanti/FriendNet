/**
 * Retorna true en caso de que la cadena pasada sea un link
 */
export function isLink(string){
    return (typeof string === "string") && (string.split("/")[0].includes('http'))
}