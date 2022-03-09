function joiErrorToJavaScriptError(error) {
    return Error(error.message.replace(/"/g, "'"))
}

module.exports = { joiErrorToJavaScriptError }