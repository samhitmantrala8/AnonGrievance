import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

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
        <Link to="/" className="font-bold text-xl mb-4 block">AnonGrievance</Link>
        <p className="text-sm mb-4">
          An anonymous complaint platform where users can report issues without revealing their identities.
        </p>
        <div className="flex justify-center gap-4">
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-1 transition duration-300 ease-in-out transform hover:bg-gray-700 hover:text-gray-300 rounded-md border border-gray-600"
            >
              {social.icon}
              <span className="self-center">{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;