/**
 * Retorna true en caso de que str sea un link
 * @param {String} str 
 */
export function isLink(str){
    const f = (str) && (typeof str === "string") && (str.split('/')[0].includes('http'))
    console.log(f ? 'Es un link' : 'No es un link')
    return f
}
