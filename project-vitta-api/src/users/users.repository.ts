import { Injectable } from "@nestjs/common";
import { CreateUsersDto } from "./dtos/CreateUsers.dto";


@Injectable()
export class UsersRepository {

    // constructor(
    //     @InjectRepository(Users) private readonly usersRepository: Repository<Users>
    // ) {}

    // async createUser(users: CreateUsersDto): Promise<string | Omit<CreateUsersDto, "password">> {
    //     const existe = await this.usersRepository.findOne({
    //         where: { email: users.email }
    //     });
    //     if (existe) {
    //         throw new BadRequestException('Este email ya está en uso');
    //     }
    //     const hashedPassword = await bcrypt.hash(users.password, 10);
    //     if (!hashedPassword) {
    //         throw new BadRequestException('Error al tratar de crear el usuario. Intente nuevamente');
    //     }
        
    //     await this.usersRepository.save({ ...users, password: hashedPassword, fecnac: new Date(users.fecnac) });

    //     const { password, ...userWithoutPassword } = users;
    //     return userWithoutPassword;
    // }

    async createUser(users: CreateUsersDto): Promise<string | Omit<CreateUsersDto, "password">> {
        return 'Haz creado un usuario correctamente ';
    }

}