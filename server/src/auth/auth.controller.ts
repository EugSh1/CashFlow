import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDto } from "./dto/user.dto";
import { Response } from "express";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { UserModel } from "src/users/response-models/user.model";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    @ApiCreatedResponse({
        description: "Registers a new user and returns the created user",
        type: UserModel
    })
    async register(@Body() userDto: UserDto): Promise<UserModel> {
        return await this.authService.register(userDto.name, userDto.password);
    }

    @Post("login")
    @ApiOkResponse({
        description:
            "Logs in the user, sets an authentication token cookie, and returns a success message",
        type: String
    })
    async logIn(
        @Body() userDto: UserDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<void> {
        const token = await this.authService.logIn(userDto.name, userDto.password);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 // 1 hour
        });

        res.status(HttpStatus.OK).send("Logged in successfully");
    }

    @Post("logout")
    @ApiOkResponse({
        description:
            "Logs out the user by clearing the authentication token cookie and returns a success message",
        type: String
    })
    logOut(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("token");
        res.status(HttpStatus.OK).send("Logged out successfully");
    }
}
