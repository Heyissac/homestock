import { z } from 'zod';

export const createSpaceSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50),
    description: z.string().max(200).optional(),
});

export const updateSpaceSchema = z.object({
    name: z.string().min(1).max(50).optional(),
    description: z.string().max(200).optional(),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceInput = z.infer<typeof updateSpaceSchema>;