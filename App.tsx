import React, { useState } from 'react';
import Header from './components/Header.tsx';
import SideNav from './components/SideNav.tsx';
import Dashboard from './components/Dashboard.tsx';
import { Module } from './types.ts';

const App: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <SideNav selectedModule={selectedModule} setSelectedModule={setSelectedModule} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Dashboard selectedModule={selectedModule} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;