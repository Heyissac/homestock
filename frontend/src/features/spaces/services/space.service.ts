import { apiClient } from '../../../lib/api';
import type {
    CreateSpaceInput,
    UpdateSpaceInput,
    SpaceResponse,
    SpacesResponse,
} from '../types/space.types';

export async function getSpaces(): Promise<SpacesResponse> {
    return apiClient.get<SpacesResponse>('/api/spaces', true);
}

export async function getSpaceById(id: string): Promise<SpaceResponse> {
    return apiClient.get<SpaceResponse>(`/api/spaces/${id}`, true);
}

export async function createSpace(input: CreateSpaceInput): Promise<SpaceResponse> {
    return apiClient.post<SpaceResponse>('/api/spaces', input, true);
}

export async function updateSpace(id: string, input: UpdateSpaceInput): Promise<SpaceResponse> {
    return apiClient.put<SpaceResponse>(`/api/spaces/${id}`, input, true);
}

export async function deleteSpace(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/spaces/${id}`, true);
}