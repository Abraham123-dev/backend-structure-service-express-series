function logger(req, res, next) {
    const time = new Date().toISOString();
    const method = req.method;
    const url = req.url;

    console.log(`[${time}] ${method} ${url}`);
    next();
}

function timer(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`Request of ${req.method} to ${req.url} took ${duration}ms`);
    });

    next();
}

module.exports = {
    logger,
    timer,
};