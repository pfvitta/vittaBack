import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SizeValidatorPipe } from '../pipes/SizeValidator.pipe';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploadImage/:id')
  @ApiOperation({
    summary: 'Sube la imagen de un producto a través de su ID',
    description:
      'Permite subir una imagen válida (jpg, jpeg, png, bmp, gif, webp, svg, ico) asociada a un usuario común o un usuario proveedor mediante su ID. Incluye validación de tipo y tamaño del archivo.',
  })
  @ApiConsumes('multipart/form-data') // ← Necesario para carga de archivos
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description:
            'Archivo de imagen que se desea subir. Formatos permitidos: jpg, jpeg, png, bmp, gif, webp, svg, ico',
          example: 'image.jpg',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(SizeValidatorPipe) // Aplicamos el pipe de validación de tamaño
  async uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'image/*', //(jpg|jpeg|png|bmp|gif|webp|svg|ico)$/',
          }),
        ],
        exceptionFactory: (errors) => {
          throw new BadRequestException(
            'El archivo no es una imagen válida. Imagenes permitidas: jpg, jpeg, png, bmp, gif, webp, svg, ico',
          );
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadImage(id, file);
  }
}
