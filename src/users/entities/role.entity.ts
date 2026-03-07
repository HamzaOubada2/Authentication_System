import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";
import { User } from "./user.entity";



@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string; //e.g., 'admin', 'user', 'editor'

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => Permission, (permission) => permission.roles, { eager: true })
    @JoinTable()
    permissions: Permission[]

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];

}

//Permission ◀──M:M──▶ Role ◀──M:M──▶ User

