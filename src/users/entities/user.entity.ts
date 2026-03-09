import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { Exclude } from "class-transformer";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;


    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ nullable: true })
    @Exclude()
    verificationToken: string; //Email verification token

    @Column({ nullable: true })
    @Exclude()
    refreshToken: string;//hashed refresh token

    @Column({ nullable: true })
    @Exclude()
    resetToken: string; //hashed password reset token

    @Column({ nullable: true, type: 'timestamp' })
    @Exclude()
    resetTokenExpiration: Date; //reset token expiration date

    @ManyToMany(() => Role, (role) => role.users, { eager: true })
    @JoinTable()
    roles: Role[];

    @CreateDateColumn()
    createdAt: Date;
}

// Permission ◀──M:M──▶ Role ◀──M:M──▶ User