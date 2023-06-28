export function UserLogged(props){
    /**
     *  Pagina creada para devolver cuando el usuario ya este autenticado
     * 
     */
    return (
        <>
            <h1>Ya estas autenticado, ve al Home</h1>
            <button>
                <a href="/home/">Ir</a>
            </button>
        </>
    )
}