import * as states from "../store"

export function resetGlobalStates(statesList){
    let state
    Object.keys(states).forEach(key => {
        state = states[key]
        if (((statesList && statesList.includes(key)) || !statesList) && state.getState().reset){
            state.getState().reset()
        }
    });
}
