import type { Request, Response } from 'express';
import { createSpaceSchema, updateSpaceSchema } from '../../../shared/types/space.schemas';
import * as spaceService from '../services/space.service';

export async function createSpaceHandler(req: Request, res: Response) {
    const result = createSpaceSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.issues[0].message });
        return;
    }

    const space = await spaceService.createSpace(req.userId!, result.data);
    res.status(201).json({ space });
}

export async function getUserSpacesHandler(req: Request, res: Response) {
    const spaces = await spaceService.getUserSpaces(req.userId!);
    res.status(200).json({ spaces });
}

export async function getSpaceByIdHandler(req: Request, res: Response) {
    const spaceId = req.params.id as string;
    const space = await spaceService.getSpaceById(req.userId!, spaceId);
    if (!space) {
        res.status(404).json({ error: 'Space not found' });
        return;
    }
    res.status(200).json({ space });
}

export async function updateSpaceHandler(req: Request, res: Response) {
    const spaceId = req.params.id as string;
    const result = updateSpaceSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.issues[0].message });
        return;
    }

    const space = await spaceService.updateSpace(req.userId!, spaceId, result.data);
    if (!space) {
        res.status(403).json({ error: 'Not authorized or space not found' });
        return;
    }

    res.status(200).json({ space });
}

export async function deleteSpaceHandler(req: Request, res: Response) {
    const spaceId = req.params.id as string;
    const success = await spaceService.deleteSpace(req.userId!, spaceId);
    if (!success) {
        res.status(403).json({ error: 'Not authorized or space not found' });
        return;
    }

    res.status(204).send();
}