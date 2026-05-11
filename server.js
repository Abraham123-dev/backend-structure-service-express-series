const express = require('express'); //import express module
const { time, timeStamp, log } = require('node:console');

const app = express(); //create express app


// my global middleware to log every request
app.use(express.json()); //express to understand json bodies this is also a middleware
app.use(logger); //use logger middleware for all routes
app.use(timer); //use timer middleware for all routes
app.use(basicRateLimiter); //use rate limiter middleware for all routes
app.use(checkAuth); //use authentication middleware for all routes

//start server route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Braudle is live!',
        version: '1.0.0',
    })
})

app.post('/api/echo', (req, res) => {
    const { message } = req.body;   
    if (!message) {
        return res.status(400).json({
            error: 'Message is required'
        });
    }
    res.status(200).json({
        message: message
    });
});

//second route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timeStamp: new Date()
    })
});

//third route
app.get('/api/version', (req, res) => {
    res.status(200).json({
        version: '1.0.0',
        build: '2024-06-01',
        name: 'Braudle Backend Test',
    })
});

const port = 5000; //define port
app.listen(port, () => {
    console.log(`Braudle backend test is running on ${port}`);
    
})

//using res.redirect to redirect to another route
app.get('/api/redirect', (req, res) => {
    res.redirect('/api/health');
})

// middleware example 1: logger middleware
function logger(req, res, next) {
    const time = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    console.log(`[${time}] ${method} ${url}`); 

    next(); //call next to pass to the next middleware or route handler
}



// middleware example 2: request time middleware
function timer(req, res, next) {
       const start = Date.now();

    //when response is finished, log the time taken
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`Request of ${req.method} to ${req.url} took ${duration}ms`);
    });

    next();
}

//middleware example 3: Rate limiter middleware (simple example, not production ready)
const requestCounts = {};
function basicRateLimiter(req, res, next) {
    const ip = req.ip;
    const now = Date.now();

    //initialize if first request from this IP
    if (!requestCounts[ip]) {
        requestCounts[ip] = { count: 1, startTime: now };
        return next();
    }   

    const timePassed = now - requestCounts[ip].startTime;

    //reset count after 1 minute
    if (timePassed > 60000) {
        requestCounts[ip] = { count: 1, startTime: now };
        return next();
    }

    //block if more than 10 requests in the last minute
    if (requestCounts[ip].count >= 10) {
        return res.status(429).json({
            error: 'Too many requests'
        });
    }

    //increment request count
    requestCounts[ip].count++;

    next();
}
 
//middleware example 4: authentication middleware (simple example, not production ready)
function checkAuth(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            error: 'No token provided, please login'
        })
    }

       if (token !== "braudle-secret-token") {
            return res.status(403).json({
                error: 'Invalid token, access denied'
            });
        }

        //for token valid - attach user info to request object (in real app, decode token and get user info)
        req.user = {
            id: 1,
            name: 'Abraham Braudle',
            role: 'Software Engineer @ Braudle Inc.'
        };

        //protecting profile route with authentication middleware
        app.get('/api/profile', checkAuth, (req, res) => {
            res.status(200).json({
                message: 'This is a protected profile route, welcome!',
                user: req.user
            })
        })

        next();
}

// my middleware structure    
