import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Role } from "./entities/role.entity";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,

        @InjectRepository(Role)
        private roleRepo: Repository<Role>
    ) { }

    //----------------------------------------
    async findAll(): Promise<User[]> {
        return this.userRepo.find();
    }

    async deleteUser(id: number): Promise<{ message: string }> {
        await this.userRepo.delete(id);
        return { message: 'User deleted successfully' };
    }

    //----------- Find ---------------------------------------------
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { email } })
    }

    async findById(id: number): Promise<User | null> {
        return this.userRepo.findOne({ where: { id } })
    }

    async findByVerifyToken(token: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { verificationToken: token } })
    }

    async findByResetToken(token: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { resetToken: token } })
    }

    //------------ CREATE ---------------------------------------------
    async create(data: Partial<User>): Promise<User> {
        const user = this.userRepo.create(data);
        return this.userRepo.save(user);
    }

    //------------ UPDATE ---------------------------------------------
    async updateRefreshToken(id: number, token: string | undefined) {
        await this.userRepo.update(id, { refreshToken: token })
    }

    async updateVerifyToken(id: number, token: string | undefined) {
        await this.userRepo.update(id, { verificationToken: token })
    }

    async markAsVerified(id: number) {
        await this.userRepo.update(id, {
            isVerified: true,
            verificationToken: undefined // Clear token after verification
        })
    }

    async updateResetToken(id: number, token: string | undefined, exp: Date | undefined) {
        await this.userRepo.update(id, {
            resetToken: token,
            resetTokenExpiration: exp
        })
    }


    async updatePassword(id: number, hashedPassword: string) {
        await this.userRepo.update(id, {
            password: hashedPassword,
            resetToken: undefined, //null //Clear Token after reset
            resetTokenExpiration: undefined
        })
    }

    //------------- ROLES --------------------------------------------------
    async assignDefaultRole(user: User): Promise<User> {
        //Find or Create the default 'user' Role
        let role = await this.roleRepo.findOne({ where: { name: 'user' } });

        if (!role) {
            role = this.roleRepo.create({
                name: 'user',
                description: 'Default user Role'
            });
            await this.roleRepo.save(role)
        }

        user.roles = [role];
        return this.userRepo.save(user);
    }

    //------------------FindAllWithResetToken-------------------------
    //!!!!!!!!!!Exp
    async FindAllWithResetToken(): Promise<User[]> {
        return this.userRepo
            .createQueryBuilder('user')
            .where('user.resetToken IS NOT NULL')
            .andWhere('user.resetTokenExpiration > :now', { now: new Date() })
            .getMany()
    }
}

/*
    ## What we Just Build:
            UsersService:
                ├── findByEmail()         → used in login
                ├── findById()            → used in refresh/logout
                ├── findByVerifyToken()   → used in email verification
                ├── findByResetToken()    → used in password reset
                ├── create()              → used in register
                ├── markAsVerified()      → clears verify token + sets isVerified
                ├── updateResetToken()    → saves hashed reset token + expiry
                ├── updatePassword()      → saves new password + clears reset token
                └── assignDefaultRole()   → gives every new user the 'user' role

    💡 assignDefaultRole() automatically creates the user role in the database if it doesn't exist yet — so the first registered user always gets a role! 🔒
*/