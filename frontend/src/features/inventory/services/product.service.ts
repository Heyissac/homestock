import { apiClient } from '../../../lib/api';
import type {
    CreateProductInput,
    UpdateProductInput,
    ProductResponse,
    ProductsResponse,
} from '../types/product.types';

export async function getProducts(spaceId: string): Promise<ProductsResponse> {
    return apiClient.get<ProductsResponse>(`/api/spaces/${spaceId}/products`, true);
}

export async function getProductById(spaceId: string, productId: string): Promise<ProductResponse> {
    return apiClient.get<ProductResponse>(`/api/spaces/${spaceId}/products/${productId}`, true);
}

export async function createProduct(spaceId: string, input: CreateProductInput): Promise<ProductResponse> {
    return apiClient.post<ProductResponse>(`/api/spaces/${spaceId}/products`, input, true);
}

export async function updateProduct(spaceId: string, productId: string, input: UpdateProductInput): Promise<ProductResponse> {
    return apiClient.put<ProductResponse>(`/api/spaces/${spaceId}/products/${productId}`, input, true);
}

export async function deleteProduct(spaceId: string, productId: string): Promise<void> {
    return apiClient.delete<void>(`/api/spaces/${spaceId}/products/${productId}`, true);
}