import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import type { CreateCategoryInput, UpdateCategoryInput } from '../../../shared/types/category.schemas';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

async function getMembership(userId: string, spaceId: string) {
    return prisma.spaceMember.findUnique({
        where: { userId_spaceId: { userId, spaceId } },
    });
}

// Devuelve todas las categorías de un space, solo si el usuario es miembro
export async function getCategories(userId: string, spaceId: string) {
    const membership = await getMembership(userId, spaceId);
    if (!membership) return null;

    return prisma.category.findMany({
        where: { spaceId },
        orderBy: { name: 'asc' },
    });
}

// Crea una categoría en el space, solo si el usuario es OWNER o EDITOR
export async function createCategory(userId: string, spaceId: string, input: CreateCategoryInput) {
    const membership = await getMembership(userId, spaceId);
    if (!membership || membership.role === 'VIEWER') return null;

    return prisma.category.create({
        data: {
            ...input,
            spaceId,
        },
    });
}

// Actualiza una categoría, solo si el usuario es OWNER o EDITOR
export async function updateCategory(userId: string, spaceId: string, categoryId: string, input: UpdateCategoryInput) {
    const membership = await getMembership(userId, spaceId);
    if (!membership || membership.role === 'VIEWER') return null;

    const exists = await prisma.category.findUnique({ where: { id: categoryId, spaceId } });
    if (!exists) return null;

    return prisma.category.update({
        where: { id: categoryId },
        data: input,
    });
}

// Elimina una categoría, solo si el usuario es OWNER
export async function deleteCategory(userId: string, spaceId: string, categoryId: string) {
    const membership = await getMembership(userId, spaceId);
    if (!membership || membership.role !== 'OWNER') return false;

    const exists = await prisma.category.findUnique({ where: { id: categoryId, spaceId } });
    if (!exists) return false;

    await prisma.category.delete({ where: { id: categoryId } });
    return true;
}