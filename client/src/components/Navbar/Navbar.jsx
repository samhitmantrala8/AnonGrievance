import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../../public/favi.png'

function Navbar() {

  const username = localStorage.getItem('username');

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/sign-in');
  };

  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();

    navigate('/sign-in');
  };

  return (
    <nav className=" bg-gray-900 fixed w-full z-20 top-0 start-0 border-b  border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" /> */}
        <div className='flex justify-center items-center gap-2 cursor-pointer'>
          <img src={logoImg} alt="logo" className='h-6 md:h-9' />
          <span className="self-center text-sm md:text-xl font-semibold whitespace-nowrap text-white font-serif">AnonGrievance</span>
        </div>
        {/* </a> */}
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {username ? (
            <div className='flex justify-center items-center gap-3'>
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
                className="text-white font-serif    focus:ring-4 focus:outline-none  font-medium rounded-lg text-[10px] md:text-sm px-4 py-2 text-center bg-red-600 hover:bg-red-700 focus:ring-red-800"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLoginClick}
              className="text-white   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
            >
              Login
            </button>
          )}
        </div>
        {/* <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white bg-gray-800 md:bg-gray-900 border-gray-700">
            <li>
              <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:text-blue-500" aria-current="page">Home</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700">About</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700">Services</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700">Contact</a>
            </li>
          </ul>
        </div> */}
      </div>
    </nav>
  );
}

export default Navbar;