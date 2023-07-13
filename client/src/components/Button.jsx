import "../styles/Button.css"
export function Button({msg, onClickFunction}){
    return (
        <div className="button-container">
            <button className="button" onClick={onClickFunction}>
                {msg}
            </button>
        </div>
    )

}