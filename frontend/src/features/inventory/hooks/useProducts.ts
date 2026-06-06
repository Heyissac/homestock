import { useState, useEffect } from 'react';
import type { Product, CreateProductInput } from '../types/product.types';
import * as productService from '../services/product.service';

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
            const data = await productService.getProducts(spaceId);
            setProducts(data.products);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar productos');
        } finally {
            setLoading(false);
        }
    }

    async function addProduct(input: CreateProductInput) {
        const data = await productService.createProduct(spaceId, input);
        setProducts((prev) => [...prev, data.product]);
    }

    async function removeProduct(productId: string) {
        await productService.deleteProduct(spaceId, productId);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
    }

    return { products, loading, error, addProduct, removeProduct };
}