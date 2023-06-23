export function generateActivationCode(){
    let randomCode = ""
    for (let i = 0; i < 6; i++){
        randomCode += Math.round(Math.random()*9)
    }
    return randomCode
}