const paginate = (page, pages) => {
  const paginationMeta = {
    page,
    pages,
  };
  if (page > 1) paginationMeta.hasPrevPage = true;
  if (page < pages) paginationMeta.hasNextPage = true;
  return paginationMeta;
};

export default paginate;
