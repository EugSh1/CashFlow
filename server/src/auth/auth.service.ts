import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";
import { User } from "generated/prisma";
import { errorMessages } from "src/constants/errorMessages";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(name: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.usersService.createUser({ name, password: hashedPassword });
    }

    async logIn(name: string, password: string) {
        let user: User;

        try {
            user = await this.usersService.getUserByName(name);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new UnauthorizedException(errorMessages.auth.INVALID_CREDENTIALS);
            }
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException(errorMessages.auth.INVALID_CREDENTIALS);
        }

        const payload = { sub: user.id };
        return await this.jwtService.signAsync(payload);
    }
}
