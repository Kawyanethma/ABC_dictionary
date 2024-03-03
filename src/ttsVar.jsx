import React,{ useState } from "react";

const initalState = {
    voice: null,
    pitch: 1,
    rate: 1,
    volume: 1,
}

export const Context = React.createContext();

const TtsVar = ({children}) => {
    const[state, setState] = useState(initalState);

    return(
        <Context.Provider value={[state, setState]}>{children}</Context.Provider>
    );
}

export default TtsVar;
