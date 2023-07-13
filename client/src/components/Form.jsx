import "../styles/Form.css"
export function Form({children, onSubmitFunction}){
    return (
        <form className="form-container" onSubmit={onSubmitFunction}>
            {children}
        </form>
    )
}