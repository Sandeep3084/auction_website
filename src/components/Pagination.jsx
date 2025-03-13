import React from 'react';

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {Array.from({ length: totalPages }).map((_, pageIndex) => (
        <button
          key={pageIndex}
          onClick={() => setCurrentPage(pageIndex)}
          className={`px-4 py-2 rounded ${
            currentPage === pageIndex
              ? 'bg-purple-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Page {pageIndex + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
