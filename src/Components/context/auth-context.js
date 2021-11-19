import React from 'react';
import { useState } from 'react';

const AuthContext = React.createContext({
    user: {},
    isLoggedIn: false,
    token: '',
    login: (token,user) => {},
    logout: () => {}
})

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const userIsLoggedIn = !!token;

    const loginHandler = (token,user) => {
        setUser({
            name: user.name,
            id: user.uid
        });
        setToken(token)
    }
    
    const logoutHandler = () => {
        setUser(null);
        setToken(null);
    }

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