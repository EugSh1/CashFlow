import { Prisma } from "generated/prisma";

export const isPrismaNotFoundError = (error: unknown) =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";

export const isPrismaUniqueConstraintFailed = (error: unknown) =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
