const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Unlock Scottish Grants & Funding
        </h1>
        <p className="text-xl mb-8">
          From heating upgrades, to free solar panels, to improving the look of Scotland homes. 
          Funding for Scotland are here to help people in Scotland unlock the funding and grant schemes they are entitled to
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-lg">
          <div className="bg-white/10 p-4 rounded">✅ Free Solar Panels</div>
          <div className="bg-white/10 p-4 rounded">✅ Free Heating Upgrades</div>
          <div className="bg-white/10 p-4 rounded">✅ Free Insulation</div>
          <div className="bg-white/10 p-4 rounded">✅ Free Gas Boilers</div>
          <div className="bg-white/10 p-4 rounded md:col-span-2">✅ Grants for Home Improvements</div>
        </div>
      </div>
    </div>
  );
};

export default Index;