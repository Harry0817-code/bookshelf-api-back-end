const { addBookHandler,
    editBookByIdHandler,
    deleteBookeByIdHandler,
    getAllBookWithConditionHandler } = require('./handler');

module.exports = [{
    method: 'POST',
    path: '/books',
    handler: addBookHandler
},
{
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookByIdHandler,
},
{
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookeByIdHandler,
},
{
    method: 'GET',
    path: '/books/{id}',
    handler: getAllBookWithConditionHandler
},
{
    method: 'GET',
    path: '/books',
    handler: getAllBookWithConditionHandler
}];