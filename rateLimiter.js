// Basic rate limiter middleware to prevent abuse

const requestCount = {};

function basicRateLimiter(maxRequests = 100, windowMs = 60000) {
    return (req, res, next) => {
        const clientIp = req.ip || req.connection.remoteAddress;
        const now = Date.now();

        if (!requestCount[clientIp]) {
            requestCount[clientIp] = [];
        }

        // Remove old requests outside the time window
        requestCount[clientIp] = requestCount[clientIp].filter(
            (timestamp) => now - timestamp < windowMs
        );

        // Check if limit exceeded
        if (requestCount[clientIp].length >= maxRequests) {
            return res.status(429).json({
                error: 'Too many requests. Please try again later.'
            });
        }

        // Record this request
        requestCount[clientIp].push(now);
        next();
    };
}

module.exports = {
    basicRateLimiter
};
