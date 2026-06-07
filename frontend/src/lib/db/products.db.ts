import { getDb } from './index';
import type { ProductLocal } from './schema';

// Guarda una lista de productos de un space — reemplaza lo que había
export async function saveProducts(products: ProductLocal[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction('products', 'readwrite');
    await Promise.all([
        ...products.map((product) => tx.store.put(product)),
        tx.done,
    ]);
}

// Lee todos los productos de un space usando el índice by-space
export async function getLocalProducts(spaceId: string): Promise<ProductLocal[]> {
    const db = await getDb();
    return db.getAllFromIndex('products', 'by-space', spaceId);
}

// Guarda o actualiza un producto individual
export async function saveProduct(product: ProductLocal): Promise<void> {
    const db = await getDb();
    await db.put('products', product);
}

// Elimina un producto del store local
export async function deleteLocalProduct(productId: string): Promise<void> {
    const db = await getDb();
    await db.delete('products', productId);
}