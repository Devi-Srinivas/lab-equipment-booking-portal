import { createContext, useState, useEffect } from 'react';

// AuthContext creation
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // App starting and checking user session
    // sessionStorage is separate for every browser tab, so an admin login in one tab
    // does not overwrite a student login in another tab.
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                sessionStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Login Function - User Data మరియు Token ని SessionStorage లో దాచడం
    const login = (userData) => {
        setUser(userData.user);
        sessionStorage.setItem('user', JSON.stringify({
            ...userData.user,
            token: userData.token
        }));
        // Keep the keys used by the dashboards in sync
        sessionStorage.setItem('userInfo', JSON.stringify(userData.user));
        sessionStorage.setItem('userToken', userData.token);
    };

    // Logout Function - User Data ని SessionStorage నుండి తీసివేయడం
    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('userToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};