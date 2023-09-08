import { PrismaClient } from '@prisma/client'

export async function getAll(type: keyof PrismaClient, prisma: PrismaClient) {
    return await (prisma[type] as any).findMany()
}