import React from 'react';
import { MODULES } from '../constants.tsx';

const Welcome: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-green-800 mb-4">Bienvenido a AgroConecta Perú</h2>
      <p className="text-lg text-gray-600 mb-8">
        Su plataforma integral para potenciar la agricultura peruana. Seleccione un módulo en el menú de la izquierda para comenzar.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((module) => (
          <div key={module.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center text-green-600 mb-4">
              {React.cloneElement(module.icon, { className: "h-12 w-12" })}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{module.name}</h3>
            <p className="text-gray-500">{module.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;