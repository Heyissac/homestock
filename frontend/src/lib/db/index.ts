import { openDB } from 'idb';
import type { HomeStockDB } from './schema';

const DB_NAME = 'homestock';
const DB_VERSION = 1;

// Singleton — una sola conexión reutilizada en toda la app
let dbPromise: ReturnType<typeof openDB<HomeStockDB>> | null = null;

export function getDb() {
    if (!dbPromise) {
        dbPromise = openDB<HomeStockDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                // upgrade() solo se llama cuando la DB no existe o la versión cambió
                // Es el equivalente a una migración en Prisma

                // Store de spaces — key es el id del space
                if (!db.objectStoreNames.contains('spaces')) {
                    db.createObjectStore('spaces', { keyPath: 'id' });
                }

                // Store de products con índice por spaceId
                if (!db.objectStoreNames.contains('products')) {
                    const productStore = db.createObjectStore('products', { keyPath: 'id' });
                    productStore.createIndex('by-space', 'spaceId');
                }

                // Store de categories con índice por spaceId
                if (!db.objectStoreNames.contains('categories')) {
                    const categoryStore = db.createObjectStore('categories', { keyPath: 'id' });
                    categoryStore.createIndex('by-space', 'spaceId');
                }

                // Store de mutaciones pendientes con índice por fecha
                if (!db.objectStoreNames.contains('pendingMutations')) {
                    const mutationStore = db.createObjectStore('pendingMutations', { keyPath: 'id' });
                    mutationStore.createIndex('by-createdAt', 'createdAt');
                }
            },
        });
    }

    return dbPromise;
}

export * from './spaces.db';
export * from './products.db';
export * from './categories.db';
export * from './schema';
export * from './mutations.db';