const Stats = ({ teams }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team, index) => {
        const totalStats = team.cards.reduce(
          (acc, card) => ({
            Strength: acc.Strength + parseFloat(card.STRENGTH || 0),
            Stamina: acc.Stamina + parseFloat(card.STAMINA || 0),
            Dexterity: acc.Dexterity + parseFloat(card.DEXTERITY || 0),
            Intelligence: acc.Intelligence + parseFloat(card.INTELLIGENCE || 0),
            Magic: acc.Magic + parseFloat(card.MAGIC || 0),
          }),
          { Strength: 0, Stamina: 0, Dexterity: 0, Intelligence: 0, Magic: 0 }
        );
  
        return (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-300">
            <h3 className="text-xl font-bold mb-4">{team.name}</h3>
            <ul>
              {Object.entries(totalStats).map(([stat, value]) => (
                <li key={stat}>{stat}: {value.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
  
  export default Stats;
  