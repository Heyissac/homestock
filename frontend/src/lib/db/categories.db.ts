import { getDb } from './index';
import type { CategoryLocal } from './schema';

export async function saveCategories(categories: CategoryLocal[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction('categories', 'readwrite');
    await Promise.all([
        ...categories.map((category) => tx.store.put(category)),
        tx.done,
    ]);
}

export async function getLocalCategories(spaceId: string): Promise<CategoryLocal[]> {
    const db = await getDb();
    return db.getAllFromIndex('categories', 'by-space', spaceId);
}

export async function saveCategory(category: CategoryLocal): Promise<void> {
    const db = await getDb();
    await db.put('categories', category);
}

export async function deleteLocalCategory(categoryId: string): Promise<void> {
    const db = await getDb();
    await db.delete('categories', categoryId);
}