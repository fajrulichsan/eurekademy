// src/context/MyContext.js
import { createContext } from "react";

const MyContext = createContext();

// eslint-disable-next-line react/prop-types
const MyContextProvider = ({ children }) => {
    const baseUrl = "http://localhost:3000";


    return (
        <MyContext.Provider value={{ baseUrl }}>
            {children}
        </MyContext.Provider>
    );
};

export { MyContext, MyContextProvider };
