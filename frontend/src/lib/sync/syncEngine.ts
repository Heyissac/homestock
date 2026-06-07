import * as productService from '../../features/inventory/services/product.service';
import * as categoryService from '../../features/inventory/services/category.service';
import * as spaceService from '../../features/spaces/services/space.service';
import {
    getPendingMutations,
    removeMutation,
    saveProduct,
    saveCategory,
    saveSpace,
    deleteLocalProduct,
    deleteLocalCategory,
    deleteLocalSpace,
} from '../db';
import type { PendingMutation } from '../db/schema';

// Estado interno — evita que dos replays corran en paralelo
let isSyncing = false;

export async function replayMutations(): Promise<void> {
    if (isSyncing) return;
    isSyncing = true;

    try {
        const mutations = await getPendingMutations();

        for (const mutation of mutations) {
            try {
                await processMutation(mutation);
                await removeMutation(mutation.id);
            } catch (err) {
                // Si una mutación falla, detenemos el replay
                // No queremos procesar mutaciones que dependen de una fallida
                console.error('[sync] Mutation failed, stopping replay:', mutation, err);
                break;
            }
        }
    } finally {
        isSyncing = false;
    }
}

async function processMutation(mutation: PendingMutation): Promise<void> {
    const { resource, type, spaceId, payload } = mutation;

    if (resource === 'products') {
        await processProductMutation(type, spaceId, payload);
    } else if (resource === 'categories') {
        await processCategoryMutation(type, spaceId, payload);
    } else if (resource === 'spaces') {
        await processSpaceMutation(type, spaceId, payload);
    }
}

async function processProductMutation(
    type: PendingMutation['type'],
    spaceId: string,
    payload: unknown
): Promise<void> {
    const p = payload as Record<string, unknown>;

    if (type === 'CREATE') {
        const data = await productService.createProduct(
            spaceId,
            payload as unknown as Parameters<typeof productService.createProduct>[1]
        );
        await saveProduct(data.product as unknown as Parameters<typeof saveProduct>[0]);

        const tempId = p.id as string | undefined;
        if (tempId?.startsWith('temp_')) {
            await deleteLocalProduct(tempId);
        }
    } else if (type === 'UPDATE') {
        const { productId, updatedAt: localUpdatedAt, ...input } = p;

        // Obtener la versión actual del servidor antes de sobrescribir
        const serverData = await productService.getProductById(spaceId, productId as string);
        const serverUpdatedAt = new Date(serverData.product.updatedAt).getTime();
        const localUpdatedAtMs = new Date(localUpdatedAt as string).getTime();

        // Last-write-wins: si el servidor tiene una versión más nueva, descartamos
        if (serverUpdatedAt > localUpdatedAtMs) {
            console.log('[sync] Server version is newer, discarding local UPDATE for product:', productId);
            // Actualizamos IndexedDB con la versión del servidor para que la UI sea consistente
            await saveProduct(serverData.product as unknown as Parameters<typeof saveProduct>[0]);
            return;
        }

        const data = await productService.updateProduct(
            spaceId,
            productId as string,
            input as unknown as Parameters<typeof productService.updateProduct>[2]
        );
        await saveProduct(data.product as unknown as Parameters<typeof saveProduct>[0]);
    } else if (type === 'DELETE') {
        await productService.deleteProduct(spaceId, p.productId as string);
    }
}

async function processCategoryMutation(
    type: PendingMutation['type'],
    spaceId: string,
    payload: unknown
): Promise<void> {
    const p = payload as Record<string, unknown>;

    if (type === 'CREATE') {
        const data = await categoryService.createCategory(
            spaceId,
            payload as unknown as Parameters<typeof categoryService.createCategory>[1]
        );
        await saveCategory(data.category as unknown as Parameters<typeof saveCategory>[0]);

        const tempId = p.id as string | undefined;
        if (tempId?.startsWith('temp_')) {
            await deleteLocalCategory(tempId);
        }
    } else if (type === 'UPDATE') {
        const { categoryId, updatedAt: localUpdatedAt, ...input } = p;

        // Category no tiene updatedAt en el schema actual — usamos el GET para comparar
        // Si en el futuro se agrega updatedAt a Category, este bloque ya está preparado
        if (localUpdatedAt !== undefined) {
            const serverData = await categoryService.getCategories(spaceId);
            const serverCategory = serverData.categories.find(
                (c) => c.id === (categoryId as string)
            );

            if (serverCategory) {
                // Si Category tuviera updatedAt haríamos la comparación aquí
                // Por ahora el UPDATE de category siempre se aplica
            }
        }

        const data = await categoryService.updateCategory(
            spaceId,
            categoryId as string,
            input as unknown as Parameters<typeof categoryService.updateCategory>[2]
        );
        await saveCategory(data.category as unknown as Parameters<typeof saveCategory>[0]);
    } else if (type === 'DELETE') {
        await categoryService.deleteCategory(spaceId, p.categoryId as string);
    }
}

async function processSpaceMutation(
    type: PendingMutation['type'],
    _spaceId: string,
    payload: unknown
): Promise<void> {
    const p = payload as Record<string, unknown>;

    if (type === 'CREATE') {
        const data = await spaceService.createSpace(
            payload as unknown as Parameters<typeof spaceService.createSpace>[0]
        );
        await saveSpace(data.space as unknown as Parameters<typeof saveSpace>[0]);

        const tempId = p.id as string | undefined;
        if (tempId?.startsWith('temp_')) {
            await deleteLocalSpace(tempId);
        }
    } else if (type === 'UPDATE') {
        const { id, ...input } = p;
        const data = await spaceService.updateSpace(
            id as string,
            input as unknown as Parameters<typeof spaceService.updateSpace>[1]
        );
        await saveSpace(data.space as unknown as Parameters<typeof saveSpace>[0]);
    } else if (type === 'DELETE') {
        await spaceService.deleteSpace(p.id as string);
    }
}