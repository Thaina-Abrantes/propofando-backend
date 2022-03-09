function exampleMiddleware(request, _, next) {
    request.cookies.user = {
        name: "example"
    };

    return next();
}

module.exports = { exampleMiddleware }