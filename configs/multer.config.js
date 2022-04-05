const multer = require('multer');
const { generateUuid } = require('../src/helpers/handleUuid');
const path = require('path');

const maxSizeInBytes = 500 * 1024 * 1024;

const uploadFolder = path.resolve(__dirname, '../tmp/uploads');

const uploadConfig = multer({
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename(req, file, callback) {
      const fileType = file.mimetype.split('/')[1];

      const filename = `${generateUuid()}.${fileType}`;

      return callback(null, filename);
    },
  }),
  limits: {
    fileSize: maxSizeInBytes,
  },
});

module.exports = {
  uploadConfig,
};
