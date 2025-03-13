import React, { useState } from 'react';
import Catalog from './Catalog';
import Stats from './Stats';

const Tabs = ({ characters, teams, assignToTeam }) => {
  const [activeTab, setActiveTab] = useState('catalog');

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded ${
            activeTab === 'catalog' ? 'bg-purple-500 text-white' : 'bg-gray-200'
          }`}
        >
          Catalog
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded ${
            activeTab === 'stats' ? 'bg-purple-500 text-white' : 'bg-gray-200'
          }`}
        >
          Team Stats
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'catalog' && (
        <Catalog characters={characters} assignToTeam={assignToTeam} />
      )}
      {activeTab === 'stats' && <Stats teams={teams} />}
    </div>
  );
};

export default Tabs;
