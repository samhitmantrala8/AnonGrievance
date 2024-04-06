import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import logoImg from '/favi.png'

const Footer = () => {
  const socials = [
    {
      name: "Github",
      icon: <FaGithub />,
      link: "https://github.com/ojasvatomar47/hackbyte-winning-project"
    },
  ];

  return (
    <footer className="bg-gray-800 text-white py-12 flex flex-col items-center">
      <div className="container mx-auto px-4 text-center">
        <div className='flex justify-center items-center gap-2 cursor-pointer mb-4'>
          <img src={logoImg} alt="logo" className='h-6 md:h-9' />
          <span className="self-center text-sm md:text-xl font-semibold whitespace-nowrap dark:text-white font-serif">AnonGrievance</span>
        </div>
        <p className="text-sm md:text-lg mb-4 font-mono">
          An anonymous complaint platform where users can report issues without revealing their identities.
        </p>
        <div className="flex justify-center gap-4">
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-1 transition duration-300 ease-in-out transform hover:bg-gray-700 hover:text-gray-300 rounded-md border-2 border-gray-600"
            >
              {social.icon}
              <span className="self-center font-serif md:text-xl">{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;