import React, { useState } from 'react';

type Props = {
    total: number,
    size: number,
    onPageChange: (page: number, size: number)=>void,
    renderItem: (item:object)=>void
}
  
function Pagination(props: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSize, setCurrentSize] = useState(15);

  const totalPages = Math.ceil(props.total/props.size);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    props.onPageChange(page,currentSize);
  };

  const renderPagination = () => {
    const pages = [];
    const visiblePages = [];
    const pageSpread = 2; // Number of nearby pages to show

    // Add first page
    pages.push(
      <button key={1} onClick={() => handlePageClick(1)}>
        1
      </button>
    );

    // Add current page and nearby pages
    for (let i = currentPage - pageSpread; i <= currentPage + pageSpread; i++) {
      if (i > 1 && i < totalPages) {
        visiblePages.push(i);
      }
    }

    // Add ellipsis if there are pages between first and nearby pages
    if (visiblePages[0] > 2) {
      pages.push(<span key="ellipsis1">...</span>);
    }

    // Add nearby pages
    visiblePages.forEach((page) => {
      pages.push(
        <button key={page} onClick={() => handlePageClick(page)} disabled={page === currentPage}>
          {page}
        </button>
      );
    });

    // Add ellipsis if there are pages between nearby pages and last page
    if (visiblePages[visiblePages.length - 1] < totalPages - 1) {
      pages.push(<span key="ellipsis2">...</span>);
    }

    // Add last page
    pages.push(
      <button key={totalPages} onClick={() => handlePageClick(totalPages)}>
        {totalPages}
      </button>
    );

    return pages;

//
  };

  const renderItems = () => {
    const startIndex = (currentPage - 1) * props.size;
    const endIndex = Math.min(startIndex + props.size, props.total);
    const items = [];
    for (let i = startIndex; i < endIndex; i++) {
      items.push(props.renderItem(i));
    }
    return items;
  };

  return (
    <div>
      {renderPagination()}
      <p>Current Page: {currentPage}</p>
      <div>{renderItems()}</div>
    </div>
  );
};

export default Pagination;
