import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class SizeValidatorPipe implements PipeTransform<any, any> {
    transform(value: any, metadata: ArgumentMetadata) {
        if (!value) {
            console.log('No se ha proporcionado un archivo de imagen');
            throw new BadRequestException   ('Debe adjuntar un archivo de imagen');
        }

        const minSize = 51200; // 50 KB
        const maxSize = 204800; // 200 KB
        if (value.size < minSize) {
            throw new BadRequestException   ('El archivo no puede tener un tamaño menor de 50kb');
        } else if (value.size > maxSize) {
            throw new BadRequestException   ('El archivo no puede tener un tamaño mayor de 200kb');
        }
        return value;
    }
}