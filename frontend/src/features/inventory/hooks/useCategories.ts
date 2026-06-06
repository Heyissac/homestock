import { useState, useEffect } from 'react';
import type { Category, CreateCategoryInput } from '../types/category.types';
import * as categoryService from '../services/category.service';

export function useCategories(spaceId: string) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, [spaceId]);

    async function fetchCategories() {
        try {
            setLoading(true);
            setError(null);
            const data = await categoryService.getCategories(spaceId);
            setCategories(data.categories);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    }

    async function addCategory(input: CreateCategoryInput) {
        const data = await categoryService.createCategory(spaceId, input);
        setCategories((prev) => [...prev, data.category]);
    }

    async function removeCategory(categoryId: string) {
        await categoryService.deleteCategory(spaceId, categoryId);
        setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    }

    return { categories, loading, error, addCategory, removeCategory };
}