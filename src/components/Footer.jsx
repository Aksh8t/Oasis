import React from 'react';
import { LeafIcon } from './Icons.jsx';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-24 transition-colors duration-500">
      <div className="container mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Left Section */}
        <div className="mb-4 md:mb-0">
          <a
            href="#"
            className="flex items-center justify-center md:justify-start gap-2 text-2xl font-bold text-brand-dark dark:text-brand-light mb-2 transition-colors duration-300"
          >
            <LeafIcon />
            <span>Oasis</span>
          </a>
          <p className="text-gray-500 dark:text-gray-400">
            Your space for digital wellness.
          </p>
        </div>

        {/* Right Section Links */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <a
            href="#"
            className="text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-brand-primary transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-brand-primary transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-brand-primary transition-colors"
          >
            Contact
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 py-4 transition-colors duration-500">
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Oasis. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
