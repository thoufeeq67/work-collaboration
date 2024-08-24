import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-orange-400 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <a href="/">Logo</a>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* Navbar Links */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6`}
        >
          <a
            href="/"
            className="block text-white text-lg font-semibold mt-4 md:mt-0"
          >
            Home
          </a>
          <a
            href="#about"
            className="block text-white text-lg font-semibold mt-4 md:mt-0"
          >
            About
          </a>
          <a
            href="#services"
            className="block text-white text-lg font-semibold mt-4 md:mt-0"
          >
            Services
          </a>
          <a
            href="/contact"
            className="block text-white text-lg font-semibold mt-4 md:mt-0"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
