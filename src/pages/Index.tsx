import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-6">Unlock Scottish Grants & Funding</h1>
        <p className="text-xl mb-8">From heating upgrades, to free solar panels, to improving the look of Scotland homes. Funding for Scotland are here to help people in Scotland unlock the funding and grant schemes they are entitled to</p>
        <ul className="space-y-3 text-lg">
          <li>✅ Free Solar Panels</li>
          <li>✅ Free Heating Upgrades</li>
          <li>✅ Free Insulation</li>
          <li>✅ Free Gas Boilers</li>
          <li>✅ Grants for Home Improvements</li>
        </ul>
      </div>
    </div>
  );
};

export default Index;