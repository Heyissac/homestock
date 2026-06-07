import { getDb } from './index';
import type { SpaceLocal } from './schema';

// Guarda una lista de spaces — se llama después de un GET /api/spaces exitoso
export async function saveSpaces(spaces: SpaceLocal[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction('spaces', 'readwrite');
    await Promise.all([
        ...spaces.map((space) => tx.store.put(space)),
        tx.done,
    ]);
}

// Lee todos los spaces guardados localmente
export async function getLocalSpaces(): Promise<SpaceLocal[]> {
    const db = await getDb();
    return db.getAll('spaces');
}

// Guarda o actualiza un space individual — se llama después de CREATE o UPDATE
export async function saveSpace(space: SpaceLocal): Promise<void> {
    const db = await getDb();
    await db.put('spaces', space);
}

// Elimina un space del store local
export async function deleteLocalSpace(spaceId: string): Promise<void> {
    const db = await getDb();
    await db.delete('spaces', spaceId);
}