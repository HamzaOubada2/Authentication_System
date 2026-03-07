import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string; // create:user, delete:post, etc.

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[]
}

//Permission ◀──M:M──▶ Role ◀──M:M──▶ User