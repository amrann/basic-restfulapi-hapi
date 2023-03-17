const { nanoid } = require('nanoid')
const books = require('./books')

function failedFound(msg, h, code) {
  const resp = h.response({
    status: 'fail',
    message: msg
  })
  resp.code(code)
  return resp
}

const addBook = (req, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload
  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  var finished = false

  if (name === undefined) {
    const response = failedFound('Gagal menambahkan buku. Mohon isi nama buku', h, 400)
    return response
  }
  
  if (pageCount < readPage) {
    const response = failedFound('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', h, 400)
    return response
  } else if (pageCount === readPage) {
    finished = true
  }

  const newBook = {
    name, year, author, summary, publisher, pageCount, readPage, finished, reading, id, insertedAt, updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((item) => item.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = failedFound('Gagal menambahkan buku', h, 500)
  return response
}

const getAllBooks = () => ({
  status: 'success',
  data: {
    books: books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }))
  }
})

const getBookById = (req, h) => {
  const { bookId } = req.params
  const book = books.filter((n) => n.id === bookId)[0]
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }   
  }
  const response = failedFound('Buku tidak ditemukan', h, 404)
  return response
}

const editBook = (req, h) => {
  const { bookId } = req.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload
  const updatedAt = new Date().toISOString()
  var finished = false

  if (name === undefined) {
    const response = failedFound('Gagal memperbarui buku. Mohon isi nama buku', h, 400)
    return response
  }

  if (pageCount < readPage) {
    const response = failedFound('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', h, 400)
    return response
  } else if (pageCount === readPage) {
    finished = true
  }

  const index = books.findIndex((item) => item.id === bookId)

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, year,
      author, summary,
      publisher, pageCount,
      readPage, reading,
      finished, updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBook = (req, h) => {
  const { bookId } = req.params
  
  const index = books.findIndex((item) => item.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}


module.exports = { addBook, getAllBooks, getBookById, editBook, deleteBook }




























