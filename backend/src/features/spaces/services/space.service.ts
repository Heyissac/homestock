import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import type { CreateSpaceInput, UpdateSpaceInput } from '../../../shared/types/space.schemas';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

// Crea un Space y automáticamente asigna al creador como OWNER
export async function createSpace(userId: string, input: CreateSpaceInput) {
    const space = await prisma.space.create({
        data: {
            name: input.name,
            description: input.description,
            members: {
                create: {
                    userId,
                    role: 'OWNER',
                },
            },
        },
        include: {
            members: true,
        },
    });

    return space;
}

// Devuelve todos los spaces a los que pertenece el usuario
export async function getUserSpaces(userId: string) {
    const memberships = await prisma.spaceMember.findMany({
        where: { userId },
        include: {
            space: true,
        },
        orderBy: {
            joinedAt: 'asc',
        },
    });

    return memberships.map((m) => ({
        ...m.space,
        role: m.role,
    }));
}

// Devuelve un Space por ID, solo si el usuario es miembro
export async function getSpaceById(userId: string, spaceId: string) {
    const membership = await prisma.spaceMember.findUnique({
        where: {
            userId_spaceId: { userId, spaceId },
        },
        include: {
            space: true,
        },
    });

    if (!membership) return null;

    return {
        ...membership.space,
        role: membership.role,
    };
}

// Actualiza un Space, solo si el usuario es OWNER
export async function updateSpace(userId: string, spaceId: string, input: UpdateSpaceInput) {
    const membership = await prisma.spaceMember.findUnique({
        where: {
            userId_spaceId: { userId, spaceId },
        },
    });

    if (!membership || membership.role !== 'OWNER') return null;

    return prisma.space.update({
        where: { id: spaceId },
        data: input,
    });
}

// Elimina un Space, solo si el usuario es OWNER
export async function deleteSpace(userId: string, spaceId: string) {
    const membership = await prisma.spaceMember.findUnique({
        where: {
            userId_spaceId: { userId, spaceId },
        },
    });

    if (!membership || membership.role !== 'OWNER') return false;

    await prisma.space.delete({ where: { id: spaceId } });
    return true;
}