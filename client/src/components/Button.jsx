import "../styles/Button.css"
export function Button({msg, onClickFunction, type}){
    return (
        <div className="button-container">
            {type === "submit" &&
                <button  className="button" type="submit">
                    {msg}
                </button>
            }
            {!type &&
                <button onClick={onClickFunction} className="button" >
                    {msg}
                </button>
            }

        </div>
    )

}