import { createContext, useContext, useState } from "react";

const GlobalContext = createContext("");

const GlobalContextProvider = ({ children }) => {
    const [token, setToken] = useState("");

    return (
        <GlobalContext.Provider
            value={{
                token,
                setToken
            }}
        >
        {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;

export const useGlobalState = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error(
            "useGlobalState must be used inside the globalContext provider"
        );
    }

    return context;
}