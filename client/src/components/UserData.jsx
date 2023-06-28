export function UserData(props){
    /**
     * Componente creado para ser usado en conjunto con api getUserDetail
     * Toma los elementos de props.userData y retorna una lista de 
     * <p>'s con los atributos formateados
     */
    const NON_SHOWABLE_ATTRS = ["photo_link", "is_active", "id"]
    const userData = props.userData
    return Object.keys(userData).map((key)=>{
        if (!(NON_SHOWABLE_ATTRS.includes(key))){
            let showKey = null
            if (key === "username"){
                showKey = "Nombre de usuario"
            } else if (key === "first_names"){
                showKey = "Primeros nombres"
            } else if (key === "last_names"){
                showKey = "Apellidos"
            } else if (key === "age"){
                showKey = "Edad"
            } else if (key === "email"){
                showKey = "Correo electronico"
            }
            return <p key={key}>{showKey} : {userData[key]}</p>
        }
    })
}