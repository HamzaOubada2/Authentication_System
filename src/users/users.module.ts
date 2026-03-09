import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { Permission } from "./entities/permission.entity";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";
import { UsersController } from "./users.controller";
import { AuthModule } from "src/auth/auth.module";


@Module({
    imports: [TypeOrmModule.forFeature([Role, Permission, User]),
    forwardRef(() => AuthModule)],
    providers: [UserService],
    exports: [UserService],
    controllers: [UsersController]
})
export class UsersModule { }