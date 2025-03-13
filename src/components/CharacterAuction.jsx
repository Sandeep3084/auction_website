import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Tabs from './Tabs';

const CharacterAuction = () => {
  const [characters, setCharacters] = useState([]);
  const [teams, setTeams] = useState(
    Array.from({ length: 10 }, (_, i) => ({ name: `Team ${i + 1}`, cards: [] }))
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/chars.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              setError(results.errors);
            } else {
              setCharacters(results.data);
            }
          },
          error: (error) => {
            setError(error.message);
          },
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const assignToTeam = (character, teamIndex) => {
    setTeams((prevTeams) =>
      prevTeams.map((team, index) =>
        index === teamIndex ? { ...team, cards: [...team.cards, character] } : team
      )
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Character Auction</h1>
      <Tabs characters={characters} teams={teams} assignToTeam={assignToTeam} />
    </div>
  );
};

export default CharacterAuction;
