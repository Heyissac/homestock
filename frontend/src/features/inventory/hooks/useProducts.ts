import { useState, useEffect } from 'react';
import type { Product, CreateProductInput } from '../types/product.types';
import * as productService from '../services/product.service';
import {
    getLocalProducts,
    saveProducts,
    saveProduct,
    deleteLocalProduct,
    enqueueMutation,
} from '../../../lib/db';
import { isOnline } from '../../../lib/sync';

export function useProducts(spaceId: string) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, [spaceId]);

    async function fetchProducts() {
        try {
            setLoading(true);
            setError(null);

            const local = await getLocalProducts(spaceId);
            if (local.length > 0) {
                setProducts(local as unknown as Product[]);
                setLoading(false);
            }

            const data = await productService.getProducts(spaceId);
            await saveProducts(data.products as unknown as Parameters<typeof saveProducts>[0]);
            setProducts(data.products);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar productos');
        } finally {
            setLoading(false);
        }
    }

    async function addProduct(input: CreateProductInput) {
        if (isOnline()) {
            const data = await productService.createProduct(spaceId, input);
            await saveProduct(data.product as unknown as Parameters<typeof saveProduct>[0]);
            setProducts((prev) => [...prev, data.product]);
        } else {
            const tempProduct: Product = {
                id: `temp_${crypto.randomUUID()}`,
                spaceId,
                name: input.name,
                barcode: input.barcode ?? null,
                quantity: input.quantity ?? 0,
                minQuantity: input.minQuantity ?? 0,
                unit: input.unit ?? '',
                imageUrl: input.imageUrl ?? null,
                notes: input.notes ?? null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                categoryId: input.categoryId ?? null,
                category: null,
            };
            await saveProduct(tempProduct as unknown as Parameters<typeof saveProduct>[0]);
            await enqueueMutation('products', 'CREATE', spaceId, { id: tempProduct.id, spaceId, ...input });
            setProducts((prev) => [...prev, tempProduct]);
        }
    }

    async function removeProduct(productId: string) {
        if (isOnline()) {
            await productService.deleteProduct(spaceId, productId);
        } else {
            await enqueueMutation('products', 'DELETE', spaceId, { spaceId, productId });
        }
        await deleteLocalProduct(productId);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
    }

    return { products, loading, error, addProduct, removeProduct };
}