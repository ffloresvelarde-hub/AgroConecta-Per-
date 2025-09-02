import React from 'react';
import { Module } from '../types.ts';
import { MODULES } from '../constants.tsx';

interface SideNavProps {
  selectedModule: Module | null;
  setSelectedModule: (module: Module) => void;
}

const SideNav: React.FC<SideNavProps> = ({ selectedModule, setSelectedModule }) => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-20 border-b-2">
        <h1 className="text-2xl font-bold text-green-700">AgroConecta Perú</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4">
          {MODULES.map((module) => (
            <a
              key={module.id}
              className={`flex items-center px-4 py-3 my-1 text-gray-600 transition-colors duration-200 transform rounded-lg hover:bg-green-100 hover:text-green-700 cursor-pointer ${
                selectedModule === module.id ? 'bg-green-100 text-green-800 font-bold' : ''
              }`}
              onClick={() => setSelectedModule(module.id)}
            >
              {module.icon}
              <span className="mx-4 font-medium">{module.name}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideNav;