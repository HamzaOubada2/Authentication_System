import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/auth/guards/permissions.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { UserService } from "./users.service";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Permissions } from "src/auth/decorators/permissions.decorator";



@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UsersController {
    constructor(private userService: UserService) { }

    // Get My Profile
    @Get('me')
    getMe(@CurrentUser() user: any) {
        return this.userService.findById(user.sub)
    }

    // Get All Users (admin)
    @Get()
    @Roles('admin')
    @Permissions('read: users')
    getAllUsers() {
        return this.userService.findAll()
    }


    //Delete User (admin only)
    @Delete(':id')
    @Roles('admin')
    @Permissions('delete:user')
    deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }
}