const { formatDevError, formatErrorProd } = require("../helpers/errorHandlers")

function globalErrorHandler(
    error,
    req,
    res,
    next
) {
    const statusCode = error.statusCode ?? 500;
    console.log(error)

    if (process.env.ENVIRONMENT === "production") {
        return res.status(statusCode).json(formatErrorProd(error));
    }

    return res.status(statusCode).json(formatDevError(error));
}

module.exports = { globalErrorHandler }