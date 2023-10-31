/**
 * Generara un objeto con los parametros pasados a la funcion
 * con el formato usado entre los pages Login, SignUp y AccountActivation
 */
export function generateLocationProps(email, username, id){
    return {
        'userId' : id,
        'userEmail' : email,
        'username' : username   
    }
}