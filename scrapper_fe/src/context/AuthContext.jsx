import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../auth/firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
