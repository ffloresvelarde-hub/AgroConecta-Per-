
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200">
      <div className="flex items-center">
        {/* Placeholder for potential future search bar */}
      </div>
      <div className="flex items-center">
        <button className="flex items-center text-gray-700 hover:text-green-600 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="relative ml-4">
          <button className="flex items-center focus:outline-none">
            <div className="w-8 h-8 overflow-hidden rounded-full">
              <img src="https://picsum.photos/100" alt="Avatar de usuario" className="object-cover w-full h-full" />
            </div>
            <span className="ml-2 hidden md:inline text-sm font-semibold text-gray-700">Productor</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
