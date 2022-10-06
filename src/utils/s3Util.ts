import S3Storage from '../classes/S3Storage';

interface S3Literals {
  insertFileInAWS: (file: Express.Multer.File | undefined) => Promise<string | null>
  updateFileInAWS: (dbFile: string, file: Express.Multer.File | undefined) => Promise<void>
}

const s3Storage = new S3Storage();

const s3Util: S3Literals = {
  insertFileInAWS: async (file) => {
    if (!file) {
      return null;
    }

    await s3Storage.saveFile(file.filename);

    return file.filename;
  },
  updateFileInAWS: async (dbFile, file) => {
    if (dbFile && file) {
      await s3Storage.deleteFile(dbFile);

      await s3Storage.saveFile(file.filename);
    } else if (file) {
      await s3Storage.saveFile(file.filename);
    }
  },
};

export default s3Util;
