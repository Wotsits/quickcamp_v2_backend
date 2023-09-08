import { PrismaClient } from '@prisma/client'

export async function getOneById(type: keyof PrismaClient, id: number, prisma: PrismaClient) {
    return await (prisma[type] as any).findUnique({
        where: {
            id
        }
    })
}