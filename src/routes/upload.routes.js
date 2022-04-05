const { Router } = require('express');

const { createGenericUpload } = require('../controllers/upload');

const authentication = require('../middlewares/authentication');

const { uploadConfig } = require('../../configs/multer.config');

const routes = Router();

routes.post(
    '/upload',
    authentication,
    uploadConfig.single('file'),
    createGenericUpload,
);

module.exports = routes;
