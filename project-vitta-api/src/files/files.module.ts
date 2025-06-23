import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../common/entities/users.entity";
import { FilesController } from "./files.controller";
import { CloudinaryConfig } from "../config/cloudinary";
import { CloudinaryService } from "./cloudinary.service";
import { FilesService } from "./files.service";
import { Files } from "../common/entities/files.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Files])],
    providers: [FilesService, CloudinaryService, CloudinaryConfig],
    controllers: [FilesController]
})
export class FilesModule {}