const {
  addBooksHandler,
  getAllPreviewBooksHandler,
  getDetailedBookHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
} = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllPreviewBooksHandler
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getDetailedBookHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler
  }
]

module.exports = routes
