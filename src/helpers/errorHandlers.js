function formatErrorProd(error) {
    console.log(error)
    return {
        type: Error.name,
        error: "Something went wrong",
    };
}

function formatDevError(error) {
    return {
        type: error.name,
        error: error.message,
        errorObj: error,
        stack: error.stack,
    };
}

module.exports = { formatErrorProd, formatDevError }
