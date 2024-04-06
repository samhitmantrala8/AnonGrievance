import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../../context/DarkModeContext';  // Importing the dark mode context

const SignInPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();  // Using isDarkMode from context

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            email,
            password,
        };

        try {
            await login(userData);
            navigate('/');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('An error occurred while logging in.');
            }
        }
    };

    return (
        <div className={`flex text-white items-center justify-center h-screen w-full px-5 sm:px-0 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
            <div className={`flex ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full`}>
                <div
                    className="hidden md:block lg:w-1/2 bg-cover"
                    style={{
                        backgroundImage: "url(https://www.tailwindtap.com//assets/components/form/userlogin/login_tailwindtap.jpg)",
                    }}
                ></div>
                <div className="w-full p-8 lg:w-1/2">
                    <p className={`text-2xl xl:text-4xl font-extrabold ${isDarkMode ? 'text-blue-900' : 'text-blue-700'}`}>Welcome back!</p>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <div className="mt-4">
                        <label className="block  text-sm font-bold mb-2">
                            Email Address
                        </label>
                        <input
                            className={`text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 ${isDarkMode ? 'focus:outline-blue-700' : 'focus:outline-blue-300'}`}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-4 flex flex-col justify-between">
                        <div className="flex justify-between">
                            <label className="block text-sm font-bold mb-2">
                                Password
                            </label>
                        </div>
                        <input
                            className={`text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 ${isDarkMode ? 'focus:outline-blue-700' : 'focus:outline-blue-300'}`}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-8">
                        <button className={`bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ${isDarkMode ? 'text-white' : 'text-black'}`} onClick={handleSubmit}>
                            Login
                        </button>
                    </div>
                    <div className="mt-4 flex items-center w-full text-center">
                        <Link
                            to="/sign-up"
                            className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-700'} capitalize text-center w-full`}
                        >
                            Don&apos;t have any account yet?
                            <span className="text-blue-700"> Sign Up</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
