export function FormField(props){
    return (
        <>
            <h4>
                {props.errors}
            </h4>
            <div className="form-field">
                <label>{props.label} : </label>
                {props.children}
            </div>
        </>
    )
}