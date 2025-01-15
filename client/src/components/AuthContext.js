//context to manage user authentication
//shared state: isAuthenticated
//shared behaviour: login, logout

import React, {createContext, useState} from "react";

export const AuthContext = createContext();

//context provider
export const AuthProvider =({children})=>{

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loggedinUser, setLoggedinUser] = useState(null); //to store logged in user's info
    const [loggedinUserId, setLoggedinUserId] = useState(null); //to store logged in user's info

    const login = (email, userid)=>{
        setIsAuthenticated(true);
        setLoggedinUser(email);
        setLoggedinUserId(userid);
    };
    const logout = ()=>{
        setIsAuthenticated(false);
        setLoggedinUser(null);
        setLoggedinUserId(null);
        localStorage.removeItem('token'); // Clear the token from localStorage
    };
    
    //return shared state and behaviours to be consumed/subscribed by other components
    return (
        <AuthContext.Provider value={{isAuthenticated, loggedinUser,loggedinUserId, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};