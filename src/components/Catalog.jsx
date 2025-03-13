import React, { useState } from 'react';
import Card from './Card';
import Pagination from './Pagination';

const Catalog = ({ characters, assignToTeam }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(characters.length / itemsPerPage);

  const paginatedCharacters = characters.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <div className="flex flex-col items-center">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-screen-xl">
        {paginatedCharacters.map((character, index) => (
          <Card key={index} character={character} assignToTeam={assignToTeam} />
        ))}
      </div>

      {/* Pagination Controls */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Catalog;
