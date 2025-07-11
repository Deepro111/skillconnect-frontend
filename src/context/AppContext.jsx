import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;

    const backenedUrl = import.meta.env.VITE_BACKENED_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState({});
    const [loadingAuth, setLoadingAuth] = useState(true); 

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backenedUrl + '/api/auth/is-auth');
            // console.log("Auth check:", data.success);
            if (data.success) {
                setIsLoggedin(true);
                await getUserData();
            }
            else{
                setIsLoggedin(false);
            }
        } catch (error) {
            setIsLoggedin(false);
            // console.log("Auth check error:", error.message);
        } finally {
            setLoadingAuth(false);
        }
    };

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backenedUrl + '/api/user/data');
            data.success ? setUserData(data.userData) : toast.error(data.message);
        } catch (error) {
            // console.log("User data fetch error");
        }
    };

    useEffect(() => {
        axios.defaults.withCredentials = true;
        getAuthState();
    }, []);

    const value = {
        backenedUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
        loadingAuth,   
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
