import aws, { S3 } from 'aws-sdk';
import path from 'path';
import mime from 'mime';
import fs from 'fs';
import multerConfig from '../config/multer';
import errors from '../errors/errorsThrow';

class S3Storage {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  async saveFile(filename: string): Promise<void> {
    const originalPath = path.resolve(multerConfig.directory, filename);
    const contentType = mime.getType(originalPath);

    if (!contentType) {
      throw errors.notFound(undefined, undefined, 'especific file in "sheetMusicFile was not found"');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    this.client.putObject({
      Bucket: 'sheet-music-to-your-lyrics',
      Key: filename,
      ACL: 'public-read',
      Body: fileContent,
      ContentType: contentType,
    })
      .promise();

    await fs.promises.unlink(originalPath);
  }
}

export default S3Storage;
