function fileSizeLimitErrorHandler(err, req, res, next) {
    if (err) {
      res.status(413).json({ message: 'Por favor, envie um arquivo de até 200MB' });
    } else {
      next();
    }
}

module.exports = {
    fileSizeLimitErrorHandler,
};
