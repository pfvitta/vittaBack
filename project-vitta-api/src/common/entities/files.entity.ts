import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";

@Entity({ name:'files'})
export class Files {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        nullable: false,
    })
    filename: string;

    @Column({
        type: 'varchar',
        nullable: false,
      })
    mimetype: string;

    @Column({
        nullable: false,
    }) // tipo binario para PostgreSQL
    imgUrl: string;

    @OneToOne(() => User, user => user.file)
    user: User;

}