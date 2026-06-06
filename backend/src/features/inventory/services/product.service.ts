import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import type { CreateProductInput, UpdateProductInput } from '../../../shared/types/product.schemas';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

// Verifica que el usuario es miembro del space
async function getMembership(userId: string, spaceId: string) {
    return prisma.spaceMember.findUnique({
        where: { userId_spaceId: { userId, spaceId } },
    });
}

// Devuelve todos los productos de un space, solo si el usuario es miembro
export async function getProducts(userId: string, spaceId: string) {
    const membership = await getMembership(userId, spaceId);
    if (!membership) return null;

    return prisma.product.findMany({
        where: { spaceId },
        include: { category: true },
        orderBy: { createdAt: 'asc' },
    });
}

// Devuelve un producto por ID, solo si pertenece al space y el usuario es miembro
export async function getProductById(userId: string, spaceId: string, productId: string) {
    const membership = await getMembership(userId, spaceId);
    if (!membership) return null;

    return prisma.product.findUnique({
        where: { id: productId, spaceId },
        include: { category: true },
    });
}

// Crea un producto en el space, solo si el usuario es miembro (OWNER o EDITOR)
export async function createProduct(userId: string, spaceId: string, input: CreateProductInput) {
    const membership = await getMembership(userId, spaceId);
    if (!membership || membership.role === 'VIEWER') return null;

    return prisma.product.create({
        data: {
            ...input,
            spaceId,
        },
        include: { category: true },
    });
}

// Actualiza un producto, solo si el usuario es OWNER o EDITOR
export async function updateProduct(userId: string, spaceId: string, productId: string, input: UpdateProductInput) {
    const membership = await getMembership(userId, spaceId);
    if (!membership || membership.role === 'VIEWER') return null;

    const exists = await prisma.product.findUnique({ where: { id: productId, spaceId } });
    if (!exists) return null;

    return prisma.product.update({
        where: { id: productId },
        data: input,
        include: { category: true },
    });
}

// Elimina un producto, solo si el usuario es OWNER
export async function deleteProduct(userId: string, spaceId: string, productId: string) {
    const membership = await getMembership(userId, spaceId);
    if (!membership || membership.role !== 'OWNER') return false;

    const exists = await prisma.product.findUnique({ where: { id: productId, spaceId } });
    if (!exists) return false;

    await prisma.product.delete({ where: { id: productId } });
    return true;
}