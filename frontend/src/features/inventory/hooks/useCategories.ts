import { useState, useEffect } from 'react';
import type { Category, CreateCategoryInput } from '../types/category.types';
import * as categoryService from '../services/category.service';
import {
    getLocalCategories,
    saveCategories,
    saveCategory,
    deleteLocalCategory,
    enqueueMutation,
} from '../../../lib/db';
import { isOnline } from '../../../lib/sync';

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

            const local = await getLocalCategories(spaceId);
            if (local.length > 0) {
                setCategories(local as unknown as Category[]);
                setLoading(false);
            }

            const data = await categoryService.getCategories(spaceId);
            await saveCategories(data.categories as unknown as Parameters<typeof saveCategories>[0]);
            setCategories(data.categories);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    }

    async function addCategory(input: CreateCategoryInput) {
        if (isOnline()) {
            const data = await categoryService.createCategory(spaceId, input);
            await saveCategory(data.category as unknown as Parameters<typeof saveCategory>[0]);
            setCategories((prev) => [...prev, data.category]);
        } else {
            const tempCategory: Category = {
                id: `temp_${crypto.randomUUID()}`,
                spaceId,
                name: input.name,
                icon: input.icon ?? null,
                createdAt: new Date().toISOString(),
            };
            await saveCategory(tempCategory as unknown as Parameters<typeof saveCategory>[0]);
            await enqueueMutation('categories', 'CREATE', spaceId, { id: tempCategory.id, spaceId, ...input });
            setCategories((prev) => [...prev, tempCategory]);
        }
    }

    async function removeCategory(categoryId: string) {
        if (isOnline()) {
            await categoryService.deleteCategory(spaceId, categoryId);
        } else {
            await enqueueMutation('categories', 'DELETE', spaceId, { spaceId, categoryId });
        }
        await deleteLocalCategory(categoryId);
        setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    }

    return { categories, loading, error, addCategory, removeCategory };
}