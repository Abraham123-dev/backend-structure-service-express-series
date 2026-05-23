// writing global error handler middleware for express

function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    //for response variable
    const response = {
        error: message
    };
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }
    res.status(status).json(response);
}

module.exports = {
    errorHandler
};  

//using async error handling in express routes

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

app.post('/api/message', asyncHandler(async (req, res) => {
    const { message } = req.body;
    res.status(200).json({
        message: message
    });

}))