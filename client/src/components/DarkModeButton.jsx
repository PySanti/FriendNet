import dark_mode from "../../lottie/dark_mode"
import Lottie from "lottie-react"
import {useRef} from "react"
import "../styles/DarkModeButton.css"

/**
 * Componente creado para el dark mode
 */
export function DarkModeButton(){
    const darkModeAnimationRef = useRef()
    const handleClick = ()=>{
        const body = document.getElementsByTagName("body")[0]
        body.classList.toggle("dark")
        darkModeAnimationRef.current.setSpeed(1.6)
        darkModeAnimationRef.current.playSegments(body.classList.contains("dark") ? [0,16] : [16,0], true)
    }
    return (
        <div className="dark-mode-button__container" onClick={handleClick}>
            <Lottie 
                loop={false}
                autoplay={false}
                animationData={dark_mode} 
                lottieRef={darkModeAnimationRef} 
                />
        </div>
    )
}