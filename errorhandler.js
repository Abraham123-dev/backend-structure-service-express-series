// Global error utilities for Express

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

function errorHandler(err, req, res, next) {
    const status = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';

    const response = { error: message };
    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    res.status(status).json(response);
}

module.exports = {
    AppError,
    errorHandler,
};