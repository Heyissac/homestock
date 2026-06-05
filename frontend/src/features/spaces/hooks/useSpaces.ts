import { useState, useEffect } from 'react';
import * as spaceService from '../services/space.service';
import type { Space, CreateSpaceInput } from '../types/space.types';

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
            const response = await spaceService.getSpaces();
            setState({ spaces: response.spaces, loading: false, error: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load spaces';
            setState({ spaces: [], loading: false, error: message });
        }
    }

    async function addSpace(input: CreateSpaceInput): Promise<boolean> {
        try {
            const response = await spaceService.createSpace(input);
            setState((prev) => ({
                ...prev,
                spaces: [...prev.spaces, response.space],
            }));
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create space';
            setState((prev) => ({ ...prev, error: message }));
            return false;
        }
    }

    async function removeSpace(id: string): Promise<boolean> {
        try {
            await spaceService.deleteSpace(id);
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