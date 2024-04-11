import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

// const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads');

@Controller('file')
export class FileController {
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './src/assets',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadPhotos(@UploadedFiles() photos: Express.Multer.File[]) {
    const secondDestination = './dist/assets'; // Lokalizacja docelowa

    photos.forEach((photo) => {
      fs.copyFileSync(photo.path, `${secondDestination}/${photo.filename}`);
    });
    return { photos };
  }

  @Get(':fileName')
  async getPhoto(@Param('fileName') fileName: string, @Req() req: any) {
    const baseUrl = req.protocol + '://' + req.get('host'); // pobierz bazowy URL z żądania
    const fileUrl = baseUrl + '/assets/' + fileName; // zbuduj pełny URL pliku

    const filePath = path.join(__dirname, '..', 'assets', fileName);
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      throw new NotFoundException('File not found');
    }

    return { url: fileUrl }; // zwróć pełny URL pliku
  }
}
