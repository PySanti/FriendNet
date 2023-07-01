export function Header(props) {
    return (
        <header>
            <h1>
                Welcome to friendNet{props.username && `, ${props.username}`}
            </h1>
            <p>
                Chat with the people you want !
            </p>
            {props.msg && 
            <h2>
                {props.msg}
            </h2>
            }
        </header>
    )
}
