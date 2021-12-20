import React from 'react';
import { useState,useEffect,useCallback } from 'react';

let logoutTimer: any;

interface AuthContextInterface {
    user: object;
    isLoggedIn: boolean;
    token: string;
    login?: (token: string, user: string, expirationTime: string) => void;
    logout: () => void;
}

const AuthContext = React.createContext<AuthContextInterface>({
    user: {},
    isLoggedIn: false,
    token: '',
    login: () => {},
    logout: () => {}
})

const calculateRemainingTime = (expirationTime: string) => {
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

export const AuthContextProvider:React.FC = (props) => {

    const tokenData = retrieveStoredToken();
    let initialToken;

    if (tokenData) {
        initialToken = tokenData.token;  
    }
    
    const initialName = localStorage.getItem('user')
    const [token, setToken] = useState(initialToken);

/*     interface User {
        name: string;
    } */
    
    const [user, setUser] = useState({name: initialName});

    const userIsLoggedIn = !!token;

    const logoutHandler = useCallback(() => {
        setUser({name: initialName});
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    },[initialName]);

    const loginHandler = (token: string, user: string, expirationTime: string) => {
        setUser({
            name: user,
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
    },[tokenData,logoutHandler])

    const contextValue:AuthContextInterface = {
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