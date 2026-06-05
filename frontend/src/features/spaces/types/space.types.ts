export interface Space {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    role: 'OWNER' | 'EDITOR' | 'VIEWER';
}

export interface CreateSpaceInput {
    name: string;
    description?: string;
}

export interface UpdateSpaceInput {
    name?: string;
    description?: string;
}

export interface SpacesResponse {
    spaces: Space[];
}

export interface SpaceResponse {
    space: Space;
}