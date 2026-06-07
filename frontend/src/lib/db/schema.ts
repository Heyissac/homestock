import type { DBSchema } from 'idb';

// Espejo exacto de los tipos de la app — lo que se persiste localmente
export interface SpaceLocal {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    role: 'OWNER' | 'EDITOR' | 'VIEWER';
}

export interface CategoryLocal {
    id: string;
    spaceId: string;
    name: string;
    icon: string | null;
    createdAt: string;
}

export interface ProductLocal {
    id: string;
    spaceId: string;
    name: string;
    barcode: string | null;
    quantity: number;
    minQuantity: number;
    unit: string;
    imageUrl: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    categoryId: string | null;
    category: CategoryLocal | null;  // objeto anidado, igual que la API
}

export type MutationType = 'CREATE' | 'UPDATE' | 'DELETE';

export interface PendingMutation {
    id: string;
    resource: 'spaces' | 'products' | 'categories';
    type: MutationType;
    spaceId: string;
    payload: unknown;
    createdAt: string;
}

export interface HomeStockDB extends DBSchema {
    spaces: {
        key: string;
        value: SpaceLocal;
    };
    products: {
        key: string;
        value: ProductLocal;
        indexes: { 'by-space': string };
    };
    categories: {
        key: string;
        value: CategoryLocal;
        indexes: { 'by-space': string };
    };
    pendingMutations: {
        key: string;
        value: PendingMutation;
        indexes: { 'by-createdAt': string };
    };
}