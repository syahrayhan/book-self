const { nanoid } = require('nanoid')
const books = require('./books')

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
  const finished = false
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
  const isReadPageLessThenPageCount = readPage < pageCount

  if (!isNamed) {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      })
      .code(400)
    return response
  }

  if (!isReadPageLessThenPageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      })
      .code(400)
    return response
  }

  if (isSuccess) {
    books.push(newBook)

    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id
        }
      })
      .code(201)
    return response
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal ditambahkan'
    })
    .code(500)
  return response
}

const getAllPreviewBooksHandler = () => {
  const bookPreview = books
    .map((book) => ({
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

module.exports = { addBooksHandler, getAllPreviewBooksHandler }
