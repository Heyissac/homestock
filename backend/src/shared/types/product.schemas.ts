import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    barcode: z.string().optional(),
    quantity: z.number().int().min(0).optional(),
    minQuantity: z.number().int().min(0).optional(),
    unit: z.string().optional(),
    imageUrl: z.string().url().optional(),
    notes: z.string().optional(),
    categoryId: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;