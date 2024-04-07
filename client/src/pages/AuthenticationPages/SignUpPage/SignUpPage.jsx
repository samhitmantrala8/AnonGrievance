import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../../context/DarkModeContext';  // Importing the dark mode context

const SignUpPage = () => {
    const { register, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();  // Using isDarkMode from context

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            email,
            password,
        };

        await register(userData);

        navigate('/');
    };

    return (
        <div className={`h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} items-center flex justify-center px-5 lg:px-0`}>
            <div className={`max-w-screen-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}  shadow sm:rounded-lg flex justify-center flex-1`}>
                <div className="flex-1 text-center hidden md:flex">
                    <div
                        className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{
                            backgroundImage: "url(https://www.tailwindtap.com/assets/common/marketing.svg)",
                        }}
                    ></div>
                </div>
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div className="flex flex-col items-center">
                        <div className="text-center">
                            <h1 className={`text-2xl xl:text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-blue-700'}`}>
                                Student Sign up
                            </h1>
                            <p className="text-[12px] mt-2">
                                Hey enter your details to create your account
                            </p>
                        </div>
                        <div className="w-full flex-1 mt-8">
                            <div className="mx-auto max-w-xs flex flex-col gap-4">
                                <input
                                    className={`w-full px-5 py-3 rounded-lg font-medium border placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white text-black bg-gray-100 border-gray-200`}
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    className={`w-full px-5 py-3 rounded-lg font-medium border placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white text-black bg-gray-100 border-gray-200`}
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Password"
                                />
                                <button className={`mt-5 tracking-wide font-semibold w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${isDarkMode ? 'bg-blue-900 text-gray-100 hover:bg-indigo-700' : 'bg-blue-900 text-white hover:bg-indigo-700'}`} onClick={handleSubmit}>
                                    <svg
                                        className="w-6 h-6 -ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <path d="M20 8v6M23 11h-6" />
                                    </svg>
                                    <span className="ml-3">Sign Up</span>
                                </button>
                                <p className={`mt-6 text-xs text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
                                    Already have an account?{" "}
                                    <Link
                                        to="/sign-in"
                                        className={`text-blue-900 font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default SignUpPage;
