const { nanoid } = require('nanoid')
const books = require('./books')
const {
  failedResponse,
  successResponse,
  errorResponse
} = require('./response-template')

const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  const isSuccess = id.length > 0
  const isNamed = name !== undefined
  const isReadPageLessThenPageCount = readPage <= pageCount

  if (!isNamed) {
    return h
      .response(failedResponse('Gagal menambahkan buku. Mohon isi nama buku'))
      .code(400)
  }
  if (!isReadPageLessThenPageCount) {
    return h
      .response(
        failedResponse(
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        )
      )
      .code(400)
  }

  if (isSuccess) {
    books.push(newBook)
    return h
      .response(
        successResponse('Buku berhasil ditambahkan', {
          bookId: id
        })
      )
      .code(201)
  }

  return h.response(errorResponse('Buku gagal ditambahkan'))
}

const getAllPreviewBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query
  let booksQuery = [...books]

  if (name !== undefined) {
    booksQuery = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    )
  }

  if (reading !== undefined) {
    booksQuery = books.filter((book) => book.reading === (reading === '1'))
  }

  if (finished !== undefined) {
    booksQuery = books.filter((book) => book.finished === (finished === '1'))
  }

  const bookPreview = booksQuery.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

  if (bookPreview) {
    return h.response(successResponse('', { books: bookPreview }))
  }
}

const getDetailedBookHandler = (request, h) => {
  const { bookId } = request.params
  const book = books.filter((book) => book.id === bookId)[0]

  if (book !== undefined) {
    return h.response(successResponse(undefined, { book }))
  }
  return h.response(failedResponse('Buku tidak ditemukan')).code(404)
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const index = books.findIndex((book) => book.id === bookId)
  const isSuccess = bookId.length > 0
  const isNamed = name !== undefined
  const isReadPageLessThenPageCount = readPage <= pageCount
  const updatedAt = new Date().toISOString()

  if (!isNamed) {
    return h
      .response(failedResponse('Gagal memperbarui buku. Mohon isi nama buku'))
      .code(400)
  }

  if (!isReadPageLessThenPageCount) {
    return h
      .response(
        failedResponse(
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        )
      )
      .code(400)
  }

  if (isSuccess && index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    return h.response(successResponse('Buku berhasil diperbarui'))
  }

  return h
    .response(failedResponse('Gagal memperbarui buku. Id tidak ditemukan'))
    .code(404)
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    return h.response(successResponse('Buku berhasil dihapus'))
  }
  return h
    .response(failedResponse('Buku gagal dihapus. Id tidak ditemukan'))
    .code(404)
}

module.exports = {
  addBooksHandler,
  getAllPreviewBooksHandler,
  getDetailedBookHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
