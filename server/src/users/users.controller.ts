import { Body, Controller, Get, HttpCode, HttpStatus, Put, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "src/common/guards/auth/auth.guard";
import { UserId } from "src/common/decorators/user-id/user-id.decorator";
import { UserModel } from "./response-models/user.model";
import { ApiOkResponse } from "@nestjs/swagger";
import { UserChangeNameDto } from "./dto/user-change-name.dto";
import { UserChangePasswordDto } from "./dto/user-change-password.dto";

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get("me")
    @ApiOkResponse({
        description: "Returns the authenticated user's information",
        type: UserModel
    })
    async getUser(@UserId() id: string): Promise<UserModel> {
        return await this.usersService.getUserById(id);
    }

    @Put("/name")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: "Changes the authenticated user's name",
        type: UserModel
    })
    async changeName(
        @UserId() id: string,
        @Body() userChangeNameDto: UserChangeNameDto
    ): Promise<UserModel> {
        return await this.usersService.changeName(id, userChangeNameDto.name);
    }

    @Put("/password")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: "Changes the authenticated user's password",
        type: UserModel
    })
    async changePassword(
        @UserId() id: string,
        @Body() userChangePasswordDto: UserChangePasswordDto
    ): Promise<UserModel> {
        const { oldPassword, newPassword } = userChangePasswordDto;
        return await this.usersService.changePassword(id, oldPassword, newPassword);
    }
}
