const { Router } = require('express');

const { createGenericUpload } = require('../controllers/upload');

const authentication = require('../middlewares/authentication');
const validateAccessPermission = require('../middlewares/validateAccessPermission');
const { fileSizeLimitErrorHandler } = require('../middlewares/fileSizeLimit');

const { uploadConfig } = require('../../configs/multer.config');

const routes = Router();

routes.post(
    '/upload',
    authentication,
    validateAccessPermission(['super admin']),
    uploadConfig.single('file'),
    fileSizeLimitErrorHandler,
    createGenericUpload,
);

module.exports = routes;
