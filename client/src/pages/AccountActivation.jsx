import { Header } from "../components/Header"
export function AccountActivation() {
    return (
        <>
            <Header/>
            <div>
                <h1>
                    Ingresa el código de activación
                </h1>
                <label>codigo : </label>
                <input type="text"/>
            </div>
        </>
    )
}
