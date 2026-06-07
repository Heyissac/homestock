import { getDb } from './index';
import type { PendingMutation, MutationType } from './schema';

// crypto.randomUUID() genera un UUID v4 nativo del browser — no necesita librería
function generateId(): string {
    return crypto.randomUUID();
}

// Encola una mutación pendiente
export async function enqueueMutation(
    resource: PendingMutation['resource'],
    type: MutationType,
    spaceId: string,
    payload: unknown
): Promise<void> {
    const db = await getDb();
    const mutation: PendingMutation = {
        id: generateId(),
        resource,
        type,
        spaceId,
        payload,
        createdAt: new Date().toISOString(),
    };
    await db.put('pendingMutations', mutation);
}

// Lee todas las mutaciones pendientes ordenadas por fecha — para replay en orden
export async function getPendingMutations(): Promise<PendingMutation[]> {
    const db = await getDb();
    return db.getAllFromIndex('pendingMutations', 'by-createdAt');
}

// Elimina una mutación del queue — se llama cuando el backend la confirmó
export async function removeMutation(id: string): Promise<void> {
    const db = await getDb();
    await db.delete('pendingMutations', id);
}

// Cuántas mutaciones hay pendientes — útil para mostrar un indicador en la UI
export async function getPendingCount(): Promise<number> {
    const db = await getDb();
    return db.count('pendingMutations');
}