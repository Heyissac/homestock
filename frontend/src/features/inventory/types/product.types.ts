export interface Category {
    id: string;
    name: string;
    icon: string | null;
}

export interface Product {
    id: string;
    name: string;
    barcode: string | null;
    quantity: number;
    minQuantity: number;
    unit: string;
    imageUrl: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    spaceId: string;
    categoryId: string | null;
    category: Category | null;
}

export interface CreateProductInput {
    name: string;
    barcode?: string;
    quantity?: number;
    minQuantity?: number;
    unit?: string;
    imageUrl?: string;
    notes?: string;
    categoryId?: string;
}

export interface UpdateProductInput {
    name?: string;
    barcode?: string;
    quantity?: number;
    minQuantity?: number;
    unit?: string;
    imageUrl?: string;
    notes?: string;
    categoryId?: string;
}

export interface ProductsResponse {
    products: Product[];
}

export interface ProductResponse {
    product: Product;
}