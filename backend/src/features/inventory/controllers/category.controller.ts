import type { Request, Response } from 'express';
import { createCategorySchema, updateCategorySchema } from '../../../shared/types/category.schemas';
import * as categoryService from '../services/category.service';

export async function getCategoriesHandler(req: Request, res: Response) {
    const spaceId = req.params.spaceId as string;

    const categories = await categoryService.getCategories(req.userId!, spaceId);
    if (categories === null) {
        res.status(403).json({ error: 'No tienes acceso a este space' });
        return;
    }

    res.status(200).json({ categories });
}

export async function createCategoryHandler(req: Request, res: Response) {
    const spaceId = req.params.spaceId as string;

    const result = createCategorySchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.issues[0].message });
        return;
    }

    const category = await categoryService.createCategory(req.userId!, spaceId, result.data);
    if (!category) {
        res.status(403).json({ error: 'No tienes permiso para crear categorías en este space' });
        return;
    }

    res.status(201).json({ category });
}

export async function updateCategoryHandler(req: Request, res: Response) {
    const spaceId = req.params.spaceId as string;
    const categoryId = req.params.categoryId as string;

    const result = updateCategorySchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.issues[0].message });
        return;
    }

    const category = await categoryService.updateCategory(req.userId!, spaceId, categoryId, result.data);
    if (!category) {
        res.status(404).json({ error: 'Categoría no encontrada o sin permiso' });
        return;
    }

    res.status(200).json({ category });
}

export async function deleteCategoryHandler(req: Request, res: Response) {
    const spaceId = req.params.spaceId as string;
    const categoryId = req.params.categoryId as string;

    const deleted = await categoryService.deleteCategory(req.userId!, spaceId, categoryId);
    if (!deleted) {
        res.status(404).json({ error: 'Categoría no encontrada o sin permiso' });
        return;
    }

    res.status(204).send();
}