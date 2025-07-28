import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { User } from "generated/prisma";
import { errorMessages } from "src/constants/errorMessages";
import { PrismaService } from "src/prisma/prisma.service";
import {
    isPrismaNotFoundError,
    isPrismaUniqueConstraintFailed
} from "src/utils/isPrismaNotFoundError";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async getUserById(id: string, omitPassword?: true): Promise<Omit<User, "password">>;
    async getUserById(id: string, omitPassword?: false): Promise<User>;
    async getUserById(id: string, omitPassword: boolean = true) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            ...(omitPassword ? { omit: { password: true } } : {})
        });

        if (!user) {
            throw new NotFoundException(errorMessages.user.NOT_FOUND);
        }
        return user;
    }

    async getUserByName(name: string) {
        const user = await this.prismaService.user.findUnique({ where: { name } });

        if (!user) {
            throw new NotFoundException(errorMessages.user.NOT_FOUND);
        }
        return user;
    }

    async createUser(user: Pick<User, "name" | "password">) {
        try {
            return await this.prismaService.user.create({ data: user, omit: { password: true } });
        } catch (error) {
            if (isPrismaUniqueConstraintFailed(error)) {
                throw new BadRequestException(errorMessages.user.NAME_OCCUPIED);
            }
            throw error;
        }
    }

    private async updateUser(id: string, fieldToUpdate: "name" | "password", newValue: string) {
        try {
            return await this.prismaService.user.update({
                where: { id },
                data: fieldToUpdate === "name" ? { name: newValue } : { password: newValue },
                omit: { password: true }
            });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                throw new NotFoundException(errorMessages.user.NOT_FOUND);
            } else if (fieldToUpdate === "name" && isPrismaUniqueConstraintFailed(error)) {
                throw new BadRequestException(errorMessages.user.NAME_OCCUPIED);
            }
            throw error;
        }
    }

    async changeName(userId: string, newName: string) {
        return await this.updateUser(userId, "name", newName);
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const user = await this.getUserById(userId, false);
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            throw new UnauthorizedException(errorMessages.auth.INVALID_CREDENTIALS);
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        return await this.updateUser(userId, "password", hashedNewPassword);
    }

    async deleteUser(id: string) {
        try {
            return await this.prismaService.user.delete({ where: { id } });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                throw new NotFoundException(errorMessages.user.NOT_FOUND);
            }
            throw error;
        }
    }
}
