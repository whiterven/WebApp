import React from 'react';

interface PlantInfoProps {
  info: string;
}

const PlantInfo: React.FC<PlantInfoProps> = ({ info }) => {
  return (
    <div className="mt-8 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-green-700">Plant Information</h2>
      <pre className="whitespace-pre-wrap text-gray-700">{info}</pre>
    </div>
  );
};

export default PlantInfo;