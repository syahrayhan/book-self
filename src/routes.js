const { addBooksHandler, getAllPreviewBooksHandler } = require('./handler')

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
  }
]

module.exports = routes
