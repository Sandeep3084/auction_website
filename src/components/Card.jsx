import React, { useState } from 'react';

const Card = ({ character, assignToTeam }) => {
  const [showStats, setShowStats] = useState(false);

  const toggleStats = () => {
    setShowStats((prev) => !prev);
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg w-80 h-[450px] border-4 border-purple-500 overflow-hidden group">
      {/* Default Image Section */}
      <img
        src={`/images/animania.jpg`} // Default placeholder image
        alt="Default"
        className="w-full h-full object-cover group-hover:hidden"
      />

      {/* Character Image (Visible on Hover) */}
      <img
        src={`/images/${character.NAME.toLowerCase()}.jpg`}
        alt={character.NAME}
        className="w-full h-full object-cover hidden group-hover:block"
      />

      {/* Default Overlay (Visible by Default) */}
      <div className="absolute bottom-0 left-0 group-hover:opacity-0 w-full bg-black/70 text-white p-4">
        <p className="text-sm">Anime: {character.ANIME}</p>
        <p className="text-lg font-bold text-center">{character['avg star rating']}</p>
      </div>

      {/* Hover Overlay (Visible on Hover) */}
      <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-lg font-bold uppercase">{character.NAME}</h3>
        <p className="text-sm">Anime: {character.ANIME}</p>
        <p className="text-lg font-bold">AR: {character['avg star rating']}</p>

        {/* Dropdown */}
        <select
          onChange={(e) => assignToTeam(character, parseInt(e.target.value))}
          className="mt-2 w-full bg-black text-white border border-gray-300 rounded px-2 py-1"
          defaultValue=""
        >
          <option value="" disabled>Select Team</option>
          {Array.from({ length: 10 }).map((_, i) => (
            <option key={i} value={i}>Team {i + 1}</option>
          ))}
        </select>
      </div>

      {/* Stats Button */}
      <button
        onClick={toggleStats}
        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
      >
        
      </button>

      {/* Stats Modal */}
      {showStats && (
        <div className="absolute top-10 right-2 bg-white text-black p-4 rounded-lg shadow-lg z-10">
          <h4 className="text-md font-bold mb-2">Character Stats</h4>
          <ul className="text-sm">
            <li>Strength: {character.STRENGTH}</li>
            <li>Stamina: {character.STAMINA}</li>
            <li>Dexterity: {character.DEXTERITY}</li>
            <li>Intelligence: {character.INTELLIGENCE}</li>
            <li>Magic: {character.MAGIC}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Card;
