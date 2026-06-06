import { apiClient } from '../../../lib/api';
import type {
    CreateCategoryInput,
    UpdateCategoryInput,
    CategoryResponse,
    CategoriesResponse,
} from '../types/category.types';

export async function getCategories(spaceId: string): Promise<CategoriesResponse> {
    return apiClient.get<CategoriesResponse>(`/api/spaces/${spaceId}/categories`, true);
}

export async function createCategory(spaceId: string, input: CreateCategoryInput): Promise<CategoryResponse> {
    return apiClient.post<CategoryResponse>(`/api/spaces/${spaceId}/categories`, input, true);
}

export async function updateCategory(spaceId: string, categoryId: string, input: UpdateCategoryInput): Promise<CategoryResponse> {
    return apiClient.put<CategoryResponse>(`/api/spaces/${spaceId}/categories/${categoryId}`, input, true);
}

export async function deleteCategory(spaceId: string, categoryId: string): Promise<void> {
    return apiClient.delete<void>(`/api/spaces/${spaceId}/categories/${categoryId}`, true);
}