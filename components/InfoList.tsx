import React from 'react';

interface InfoListProps {
  items: string[];
}

const InfoList: React.FC<InfoListProps> = ({ items }) => {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <svg className="w-4 h-4 mr-2 mt-1 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <span className="text-gray-600">{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default InfoList;
