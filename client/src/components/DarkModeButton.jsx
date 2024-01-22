import dark_mode from "../../lottie/dark_mode"
import Lottie from "lottie-react"
import {useRef} from "react"


/**
 * Componente creado para el dark mode
 */
export function DarkModeButton(){
    const darkModeAnimationRef = useRef()
    const handleClick = ()=>{
        document.getElementById("root").classList.toggle("dark")
        darkModeAnimationRef.current.playSegments(document.getElementById("root").classList.contains("dark") ? [0,16] : [16,0], true)
    }
    return (
        <div className="dark-mode-button__container">
            <button className="dark-mode-button" onClick={handleClick}>
                <Lottie 
                    loop={false}
                    autoplay={false}
                    animationData={dark_mode} 
                    lottieRef={darkModeAnimationRef} 
                    />
            </button>
        </div>
    )
}