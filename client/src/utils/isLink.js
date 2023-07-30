/**
 * Retorna true en caso de que str sea un link
 * @param {String} str 
 */
export function isLink(str){
    return (str) && (typeof str === "string") && (str.split('/')[0].includes('http'))
}
