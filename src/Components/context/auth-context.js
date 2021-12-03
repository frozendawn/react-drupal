import React from 'react';
import { useState,useEffect } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
    user: {},
    isLoggedIn: false,
    token: '',
    login: (token,user) => {},
    logout: () => {}
})

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingDuration = adjExpirationTime - currentTime;

    return remainingDuration;
}

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if (remainingTime <= 60000) {
        localStorage.clear();
        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime
    }

}

export const AuthContextProvider = (props) => {

    const tokenData = retrieveStoredToken();
    let initialToken;

    if (tokenData) {
        initialToken = tokenData.token;  
    }
    
    const initialName = localStorage.getItem('user')
    const [token, setToken] = useState(initialToken);
    const [user, setUser] = useState({name: initialName,id:null});

    const userIsLoggedIn = !!token;

    const logoutHandler = () => {
        setUser({name: initialName,id:null});
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }

    const loginHandler = (token,user,expirationTime) => {
        setUser({
            name: user,
            id: user.uid
        });
        setToken(token)
        localStorage.setItem('token',token); 
        localStorage.setItem('user',user);
        localStorage.setItem('expirationTime',expirationTime)

        const remainingTime = calculateRemainingTime(expirationTime);

        logoutTimer = setTimeout(logoutHandler,remainingTime);
    }

    useEffect( () => {
        if(tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    },[tokenData])

    const contextValue = {
        user: user,
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;