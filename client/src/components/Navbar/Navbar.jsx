import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoImg from '/favi.png';
import { useDarkMode } from '../../context/DarkModeContext';
import { BiSun, BiMoon } from 'react-icons/bi';

function Navbar() {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // Using toggleDarkMode from context

  // Load dark mode preference from local storage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode !== isDarkMode) {
      toggleDarkMode(); // Toggling the dark mode based on local storage
    }
  }, [isDarkMode, toggleDarkMode]);

  const handleLoginClick = () => {
    navigate('/sign-in');
  };

  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/sign-in');
  };

  return (
    <nav className={`fixed w-full z-20 top-0 start-0 border-b ${isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-slate-200 border-gray-300'}`}>

      <div className={`max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        <div className='flex justify-center items-center gap-2 cursor-pointer'>
          <img src={logoImg} alt="logo" className='h-6 md:h-9' />
          <span className="self-center text-sm md:text-xl font-semibold whitespace-nowrap font-serif">AnonGrievance</span>
        </div>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {username ? (
            <div className='flex justify-center items-center gap-2'>
              <h3 className="hidden md:block text-lg mb-2 font-mono" style={{
                backgroundImage: 'linear-gradient(to right, red, orange, yellow, green, violet)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}>
                {username}
              </h3>
              <button
                type="button"
                onClick={handleSignOut}
                className={`focus:ring-4 focus:outline-none font-medium rounded-lg text-[10px] md:text-sm px-4 py-2 text-center ${isDarkMode ? 'bg-red-600 hover:bg-red-700 focus:ring-red-800 text-white' : 'bg-red-200 hover:bg-red-300 focus:ring-red-500 text-black'}`}
              >
                Sign Out
              </button>
              <button
                onClick={toggleDarkMode}
                className={`flex items-center text-lg md:text-xl lg:text-xl font-bold p-2 ${isDarkMode ? 'text-white' : 'text-black'} border-gray-400 transition-colors duration-300`}
              >
                <span>
                  {isDarkMode ? <BiSun /> : <BiMoon />}
                </span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLoginClick}
              className={`focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 text-white' : 'bg-blue-200 hover:bg-blue-300 focus:ring-blue-500 text-black'}`}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
