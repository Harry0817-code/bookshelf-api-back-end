const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    const id = nanoid(16);
    const {name , year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name || name.trim() === "" || readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: readPage > pageCount ? "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount" : "Gagal menambahkan buku. Mohon isi nama buku",
        }).code(400);
    }

    const finished = pageCount === readPage ? true : false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBooks = {
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

    books.push(newBooks);

    const isSuccessPush = books.filter((book) => book.id  === id).length > 0;

    if (isSuccessPush){
        return h.response({
            error: false,
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id
            }       
        })
        .header('Access-Control-Allow-Origin', '*')
        .code(201);
    }

    return h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    }).code(500);
};



const editBookByIdHandler = (request, h) => {
    const {id} = request.params;
    const {name , year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    
    if (!name || name.trim() === "" || readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: readPage > pageCount ? "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount" : "Gagal memperbarui buku. Mohon isi nama buku",
        }).code(400);
    }
    
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);
    
    if (index !== -1) {
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
        };
        
        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        }).code(200);
    }
    
    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
};

const deleteBookeByIdHandler = (request, h) => {
    const {id} = request.params;
    
    const index = books.findIndex((book) => book.id === id);
    
    if (index !== -1) {
        books.splice(index, 1);
        
        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        }).code(200);
    }
    
    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404);
};

const getAllBookWithConditionHandler = (request, h) => {
    if ((!request.query || Object.keys(request.query).length === 0) && (!request.params || !request.params.id)) {
        return getAllBooks();
    }

    if (request.params && request.params.id) {
        const { id } = request.params;
        return getBookById(id, h);
    }

    if (request.query && Object.keys(request.query).length > 0) {
        const allowedKeys = ['reading', 'finished', 'name'];
        const key = Object.keys(request.query)[0];
        const val = request.query[key];
        
        if (!allowedKeys.includes(key)) {
            return h.response({
                status: 'fail',
                message: 'Parameter tidak valid'
            }).code(400);
        }

        switch (key) {
            case 'reading':
                return getAllReadingOrUnreadingBook(val);
            case 'finished':
                return getAllFinishedOrUnfinishedBook(val);
            case 'name':
                return getAllContainsNameBook(val);
            default:
                return h.response({
                    status: 'fail',
                    message: 'Buku tidak ditemukan'
                }).code(404);
        }
    }
};

function getAllBooks () {
    return {
        status: 'success',
        data: {
            books: books.map(({ id, name, publisher }) => ({
                id,
                name,
                publisher
            }))
        }
    };
}

function getBookById (id, h) {
    const book = books.find((book) => book.id === id);
    
    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book
            }
        };
    }
    
    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404);
};
    
function getAllReadingOrUnreadingBook (value) {
    const filteredBooks = books.filter(book => book.reading === (value === '1'));
    return {
        status: 'success',
        data: {
            books: filteredBooks.map(({ id, name, publisher }) => ({
                id,
                name,
                publisher
            }))
        }
    };
}

function getAllFinishedOrUnfinishedBook (value) {
    const filteredBooks = books.filter(book => book.finished === (value === '1'));
    return {
        status: 'success',
        data: {
            books: filteredBooks.map(({ id, name, publisher }) => ({
                id,
                name,
                publisher
            }))
        }
    };
}

function getAllContainsNameBook (value) {
    const filteredBooks = books.filter(book => book.name && book.name.toLowerCase().includes(value.toLowerCase()));
    return {
        status: 'success',
        data: {
            books: filteredBooks.map(({ id, name, publisher }) => ({
                id,
                name,
                publisher
            }))
        }
    };
}


module.exports = {
    addBookHandler,
    editBookByIdHandler,
    deleteBookeByIdHandler,
    getAllBookWithConditionHandler
}