const Pagination = ({ pagination, onPageChange }) => {
  const { total_pages, current_page, has_pre, has_next } = pagination;

  const handlePageClick = (e, page) => {
    e.preventDefault();
    if (page !== current_page) {
      onPageChange(page);
    }
  };

  return (
    <nav>
      <ul className="pagination justify-content-end">
        <li className={`page-item ${has_pre ? "" : "disabled"}`}>
          <a
            className="page-link"
            href="#"
            aria-label="Previous"
            onClick={(e) => handlePageClick(e, current_page - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {[...Array(total_pages).keys()].map((page) => (
          <li key={page} className="page-item">
            <a
              className={`page-link ${page + 1 === current_page ? "active" : ""}`}
              href="#"
              onClick={(e) => handlePageClick(e, page + 1)}
            >
              {page + 1}
            </a>
          </li>
        ))}
        <li className={`page-item ${has_next ? "" : "disabled"}`}>
          <a
            className="page-link"
            href="#"
            aria-label="Next"
            onClick={(e) => handlePageClick(e, current_page + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
