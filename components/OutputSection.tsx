import React from 'react';

interface OutputSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const OutputSection: React.FC<OutputSectionProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 h-full">
      <div className="flex items-center mb-3">
        <div className="text-green-600 mr-3">{icon}</div>
        <h4 className="font-semibold text-gray-700 text-md">{title}</h4>
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
};

export default OutputSection;
