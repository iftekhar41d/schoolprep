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
    const [profileImage, setProfileImage] = useState('profile1.png'); // To store profile image

    const login = (email, userid, profileImage)=>{
        setIsAuthenticated(true);
        setLoggedinUser(email);
        setLoggedinUserId(userid);
        setProfileImage(profileImage);
    };

    const logout = ()=>{
        setIsAuthenticated(false);
        setLoggedinUser(null);
        setLoggedinUserId(null);
        setProfileImage('profile1.png');
        localStorage.removeItem('token'); // Clear the token from localStorage
    };

      // Function to update the profile image
    const updateProfileImage = (newImage) => {
        setProfileImage(newImage);
    };
    
    //return shared state and behaviours to be consumed/subscribed by other components
    return (
        <AuthContext.Provider value={{isAuthenticated, loggedinUser,loggedinUserId, profileImage, updateProfileImage, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};