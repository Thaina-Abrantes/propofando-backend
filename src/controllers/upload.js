const fsp = require('fs/promises');

const { uploadFile } = require('../services/upload');

const removeFileFromDisk = fsp.unlink;

async function createGenericUpload(request, response) {
  const { file, fileValidationError } = request;

  if (request.fileValidationError) {
    return response.status(400).json(fileValidationError);
  }

  if (!file) {
    return response.status(400).json('Escolha um arquivo para fazer upload');
  }

  const { filename, path } = file;

  const readFile = await fsp.readFile(`tmp/uploads/${filename}`, (err, data) => {
    if (err) {
      throw err;
    }

    return data;
  });

  const upload = await uploadFile(filename, readFile);

  await removeFileFromDisk(path);

  return response.status(200).json({ url: upload });
}

module.exports = {
  createGenericUpload,
};
