module.exports = (query, countDocument) => {
    const objPagination = {
        limitItem: 12,
        currentPage: 1
    }
    if (query.page) {
        objPagination.currentPage = parseInt(query.page)
    }
    objPagination.skip = (objPagination.currentPage - 1) * objPagination.limitItem;
    const totalPage = Math.ceil(countDocument / objPagination.limitItem);
    objPagination.totalPage = totalPage;
    objPagination.start = objPagination.skip + 1;
    objPagination.end = Math.min(objPagination.skip + objPagination.limitItem, countDocument)
    objPagination.countDocument = countDocument;
    return objPagination;
}