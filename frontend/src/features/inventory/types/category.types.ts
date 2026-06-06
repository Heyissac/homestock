export interface Category {
    id: string;
    name: string;
    icon: string | null;
    createdAt: string;
    spaceId: string;
}

export interface CreateCategoryInput {
    name: string;
    icon?: string;
}

export interface UpdateCategoryInput {
    name?: string;
    icon?: string;
}

export interface CategoriesResponse {
    categories: Category[];
}

export interface CategoryResponse {
    category: Category;
}