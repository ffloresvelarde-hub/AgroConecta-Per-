import React from 'react';

interface InfoBlockProps {
  content: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ content }) => {
  return <p className="text-gray-600 leading-relaxed">{content}</p>;
};

export default InfoBlock;
