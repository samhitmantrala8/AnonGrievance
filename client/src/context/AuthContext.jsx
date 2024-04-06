import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(localStorage.getItem('username') || null);

    const login = async (userData) => {
        try {
            const response = await axios.post('http://localhost:8800/api/users/login', userData);
            const { username } = response.data;
            setUsername(username);
            localStorage.setItem('username', username);
            return username; // Return username on successful login
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            throw error; // Re-throw the error
        }
    };

    const register = async (userData) => {
        try {
            await axios.post('http://localhost:8800/api/users/register', userData);
            await login({ email: userData.email, password: userData.password });
        } catch (error) {
            console.error('Registration error:', error.response?.data?.message || error.message);
        }
    };

    const logout = () => {
        setUsername(null);
        localStorage.removeItem('username');
    };

    return (
        <AuthContext.Provider value={{ username, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
