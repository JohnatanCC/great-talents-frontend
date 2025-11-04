import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import api from "../services/api";
import {
    nameKeyLocalStorage,
    profileKeyLocalStorage,
    tokenKeyLocalStorage,
} from "@/constants/global.constants";

const AuthContext = createContext({
    token: null,
    profile: null,
    name: '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setToken: (_token: string, _profile: string, _name: string) => { },
    logout: () => { },
});



const AuthProvider = ({ children }: { children: ReactNode }) => {


    const [token, setToken_] = useState(
        localStorage.getItem(tokenKeyLocalStorage)
    );
    const [profile, setProfile] = useState(
        localStorage.getItem(profileKeyLocalStorage)
    );

    const [name, setName] = useState(
        localStorage.getItem(nameKeyLocalStorage)
    );

    // Function to set the authentication token
    const setToken = (newToken: string, profile: string, name: string) => {
        setToken_(newToken);
        setProfile(profile);
        setName(name)

        api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
        localStorage.setItem(tokenKeyLocalStorage, newToken);
        localStorage.setItem(profileKeyLocalStorage, profile);
        localStorage.setItem(nameKeyLocalStorage, name);
    };

    const logout = () => {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem(tokenKeyLocalStorage);
        localStorage.removeItem(profileKeyLocalStorage);
        localStorage.removeItem(nameKeyLocalStorage);
    };

    useEffect(() => {
        if (token && profile && name) {
            api.defaults.headers.common["Authorization"] = "Bearer " + token;
            localStorage.setItem(tokenKeyLocalStorage, token);
            localStorage.setItem(profileKeyLocalStorage, profile);
            localStorage.setItem(nameKeyLocalStorage, name);
        }
    }, [token, profile, name]);

    // Memoized value of the authentication context
    const contextValue = useMemo(
        () => ({
            token,
            profile,
            setToken,
            logout,
            name
        }),
        [token, profile, name]
    );

    // Provide the authentication context to the children components
    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
