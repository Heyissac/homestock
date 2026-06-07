import { useState, useEffect } from 'react';
import * as spaceService from '../services/space.service';
import type { Space, CreateSpaceInput } from '../types/space.types';
import {
    getLocalSpaces,
    saveSpaces,
    saveSpace,
    deleteLocalSpace,
    enqueueMutation,
} from '../../../lib/db';
import { isOnline } from '../../../lib/sync';

interface SpacesState {
    spaces: Space[];
    loading: boolean;
    error: string | null;
}

export function useSpaces() {
    const [state, setState] = useState<SpacesState>({
        spaces: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        fetchSpaces();
    }, []);

    async function fetchSpaces() {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            // 1. Leer IndexedDB primero
            const local = await getLocalSpaces();
            if (local.length > 0) {
                setState({ spaces: local as unknown as Space[], loading: false, error: null });
            }

            // 2. Sincronizar con la API en background
            const response = await spaceService.getSpaces();
            await saveSpaces(response.spaces as unknown as Parameters<typeof saveSpaces>[0]);
            setState({ spaces: response.spaces, loading: false, error: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load spaces';
            setState((prev) => ({ ...prev, loading: false, error: message }));
        }
    }

    async function addSpace(input: CreateSpaceInput): Promise<boolean> {
        try {
            if (isOnline()) {
                // Online: llamar a la API, persistir resultado en IndexedDB
                const response = await spaceService.createSpace(input);
                await saveSpace(response.space as unknown as Parameters<typeof saveSpace>[0]);
                setState((prev) => ({
                    ...prev,
                    spaces: [...prev.spaces, response.space],
                }));
            } else {
                // Offline: crear un objeto local optimista con ID temporal
                const tempSpace: Space = {
                    id: `temp_${crypto.randomUUID()}`,
                    name: input.name,
                    description: input.description ?? null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    role: 'OWNER',
                };
                await saveSpace(tempSpace as unknown as Parameters<typeof saveSpace>[0]);
                await enqueueMutation('spaces', 'CREATE', tempSpace.id, { id: tempSpace.id, ...input });
                setState((prev) => ({
                    ...prev,
                    spaces: [...prev.spaces, tempSpace],
                }));
            }
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create space';
            setState((prev) => ({ ...prev, error: message }));
            return false;
        }
    }

    async function removeSpace(id: string): Promise<boolean> {
        try {
            if (isOnline()) {
                await spaceService.deleteSpace(id);
            } else {
                // Offline: encolar la eliminación para cuando haya conexión
                await enqueueMutation('spaces', 'DELETE', id, { id });
            }
            // En ambos casos: eliminar localmente y actualizar UI inmediatamente
            await deleteLocalSpace(id);
            setState((prev) => ({
                ...prev,
                spaces: prev.spaces.filter((s) => s.id !== id),
            }));
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete space';
            setState((prev) => ({ ...prev, error: message }));
            return false;
        }
    }

    return {
        spaces: state.spaces,
        loading: state.loading,
        error: state.error,
        addSpace,
        removeSpace,
        refetch: fetchSpaces,
    };
}