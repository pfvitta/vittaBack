import { InjectRepository } from '@nestjs/typeorm';
import { Files } from '../common/entities/files.entity';
import { Repository } from 'typeorm';
import { User } from '../common/entities/users.entity';
import { CloudinaryService } from './cloudinary.service';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export class FilesService {
  constructor(
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadImage(id: string, file: Express.Multer.File): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const imagencargada = await this.cloudinaryService.uploadImage(file);

    if (!imagencargada) {
      throw new BadRequestException('Error al subir la imagen');
    }

    const newFile = new Files(); 
    newFile.id = uuid();
    newFile.filename = imagencargada.display_name;
    newFile.mimetype = `${imagencargada.resource_type}/${imagencargada.format}`;
    newFile.imgUrl = imagencargada.secure_url;

    user.file = newFile;

    await this.filesRepository.save(newFile);
    await this.userRepository.save(user);

    // return 'Imagen subida correctamente';
    return {
      message: 'Imagen subida correctamente',
      imgUrl: imagencargada.secure_url,
      fileId: newFile.id
    };

  }
}
