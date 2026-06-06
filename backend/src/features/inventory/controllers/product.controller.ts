import type { Request, Response } from 'express';
import { createProductSchema, updateProductSchema } from '../../../shared/types/product.schemas';
import * as productService from '../services/product.service';

export async function getProductsHandler(req: Request, res: Response) {
    const spaceId = req.params.spaceId as string;

    const products = await productService.getProducts(req.userId!, spaceId);
    if (products === null) {
        res.status(403).json({ error: 'No tienes acceso a este space' });
        return;
    }

    res.status(200).json({ products });
}

export async function getProductByIdHandler(req: Request, res: Response) {
    const spaceId = req.params.spaceId as string;
    const productId = req.params.productId as string;

    const product = await productService.getProductById(req.userId!, spaceId, productId);
    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
    }

    res.status(200).json({ product });
}

export async function createProductHandler(req: Request, res: Response) {
    const spaceId = req.params.spaceId as string;

    const result = createProductSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.issues[0].message });
        return;
    }

    const product = await productService.createProduct(req.userId!, spaceId, result.data);
    if (!product) {
        res.status(403).json({ error: 'No tienes permiso para crear productos en este space' });
        return;
    }

    res.status(201).json({ product });
}

export async function updateProductHandler(req: Request, res: Response) {
    const spaceId = req.params.spaceId as string;
    const productId = req.params.productId as string;

    const result = updateProductSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.issues[0].message });
        return;
    }

    const product = await productService.updateProduct(req.userId!, spaceId, productId, result.data);
    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado o sin permiso' });
        return;
    }

    res.status(200).json({ product });
}

export async function deleteProductHandler(req: Request, res: Response) {
    const spaceId = req.params.spaceId as string;
    const productId = req.params.productId as string;

    const deleted = await productService.deleteProduct(req.userId!, spaceId, productId);
    if (!deleted) {
        res.status(404).json({ error: 'Producto no encontrado o sin permiso' });
        return;
    }

    res.status(204).send();
}