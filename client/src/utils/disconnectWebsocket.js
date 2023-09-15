
/**
 * Revisa si el Websocket esta inicializado y si lo esta lo desconecta y anula
 * @param {Object} websocket
 */
export function disconnectWebsocket(websocket){
    if (websocket.current){
        websocket.current.close()
        websocket.current = null
    }
}