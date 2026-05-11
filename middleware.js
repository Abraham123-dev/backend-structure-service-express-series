function middleware (req, res, next) {

    //doing something here
    console.log('a request came in');
    
    //call next() to pass to the next middleware
    next();
}