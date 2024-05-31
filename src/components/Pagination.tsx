import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-end space-x-1 text-[12px] pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`rounded-xl px-2 py-1 border ${currentPage === 1 ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-primary hover:text-white'}`}
      >
        Previous
      </button>
      <span className="text-gray-500 mr-1">
        {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`rounded-xl px-2 py-1 border ${currentPage === totalPages ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-primary hover:text-white'}`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
