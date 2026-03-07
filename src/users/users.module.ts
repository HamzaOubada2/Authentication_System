import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { Permission } from "./entities/permission.entity";
import { User } from "./entities/user.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Role, Permission, User])]
})
export class UserModule { }