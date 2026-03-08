import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { Permission } from "./entities/permission.entity";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";


@Module({
    imports: [TypeOrmModule.forFeature([Role, Permission, User])],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }