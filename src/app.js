const express = require('express');
const { handleStudentMessage } = require('../controller');
const { errorHandler, AppError } = require('../errorhandler');
const { logger, timer } = require('../middleware');
const { basicRateLimiter } = require('../rateLimiter');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.use(logger);
app.use(timer);
app.use(basicRateLimiter());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Braudle is live!',
        version: '1.0.0',
    });
});

app.post('/api/echo', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({
            error: 'Message is required',
        });
    }

    res.status(200).json({
        message,
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timeStamp: new Date(),
    });
});

app.get('/api/version', (req, res) => {
    res.status(200).json({
        version: '1.0.0',
        build: '2024-06-01',
        name: 'Braudle Backend Test',
    });
});

app.get('/api/redirect', (req, res) => {
    res.redirect('/api/health');
});

function checkAuth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            error: 'No token provided, please login',
        });
    }

    if (token !== 'braudle-secret-token') {
        return res.status(403).json({
            error: 'Invalid token, access denied',
        });
    }

    req.user = {
        id: 1,
        name: 'Abraham Braudle',
        role: 'Software Engineer @ Braudle Inc.',
    };

    next();
}

app.get('/api/profile', checkAuth, (req, res) => {
    res.status(200).json({
        message: 'This is a protected profile route, welcome!',
        user: req.user,
    });
});

function validateData(req, res, next) {
    const { name, email } = req.body;
    const userInput = req.body;

    if (!name || email === undefined) {
        return res.status(400).json({
            error: 'Name and email are required',
        });
    }

    if (userInput.name.length < 3) {
        return res.status(400).json({
            error: 'Name must be at least 3 characters long',
        });
    }

    return next();
}

app.post('/api/register', validateData, (req, res) => {
    const { name, email } = req.body;

    res.status(201).json({
        message: 'User registered successfully',
        user: { name, email },
    });
});

app.post('/api/message', handleStudentMessage);

app.get('/api/error', (req, res, next) => {
    next(new AppError('This is a custom error example', 400));
});

app.get('/api/test-500', (req, res, next) => {
    next(new AppError('This is a test 500 error', 500));
});

app.get('/api/test-crash', (req, res, next) => {
    throw new Error('This is a test crash error');
});

// test route for user model and database connection
const User = require('./models/user.model');

app.post('/api/test-user', async (req, res, next) => {
    try {
        const suffix = Date.now().toString();
        const user = await User.create({
            name: 'Abraham Oluwaniyi',
            email: `abraham+${suffix}@gmail.com`,
            googleId: `1234567890-${suffix}`,
        });

        res.status(201).json({
            message: 'Test user created successfully',
            user,
        });
    } catch (error) {
        console.error('Failed to create test user:', error);
        next(new AppError(error.message || 'Failed to create test user', 500));
    }
});

app.get('/api/test-users', async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            message: 'Test users retrieved successfully',
            users,
        });
    } catch (error) {
        next(new AppError('Failed to retrieve test users', 500));
    }
});

app.use(errorHandler);

module.exports = app;
