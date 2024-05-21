import React, { useContext, useState } from "react";

export const PeerContext = React.createContext(null);


export const PeerProvider = (props)=> {

    const [user, setUser] = useState("Jesse Hall");
    return(
        <PeerContext.Provider value={{user, setUser}}>
            {props.children}
        </PeerContext.Provider>
    )
}
