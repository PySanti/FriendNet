export function DarkModeButton(){
    return (
        <div className="dark-mode-button__container">
            <button className="dark-mode-button" onClick={()=>document.getElementById("root").classList.toggle("dark")}>
                Dark
            </button>
        </div>
    )
}