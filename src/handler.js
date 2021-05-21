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
  let booksQuery = []

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
    return {
      status: 'success',
      data: {
        books: bookPreview
      }
    }
  }
}

const getDetailedBookHandler = (request, h) => {
  const { bookId } = request.params
  console.log(bookId)
  const book = books.filter((book) => book.id === bookId)[0]

  console.log(book)

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    .code(404)
  return response
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
  console.log(books)
  if (!isNamed) {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      .code(400)
    return response
  }

  if (!isReadPageLessThenPageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      .code(400)
    return response
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

    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })
      .code(200)
    return response
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    .code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus'
      })
      .code(200)
    return response
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    .code(404)
  return response
}

module.exports = {
  addBooksHandler,
  getAllPreviewBooksHandler,
  getDetailedBookHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
