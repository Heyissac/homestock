import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { CreateProductForm } from './CreateProductForm';
import type { CreateProductInput } from '../types/product.types';

export function ProductsPage() {
    const { spaceId } = useParams<{ spaceId: string }>();
    const navigate = useNavigate();
    const { products, loading, error, addProduct, removeProduct } = useProducts(spaceId!);

    async function handleAdd(input: CreateProductInput) {
        await addProduct(input);
    }

    async function handleDelete(productId: string) {
        await removeProduct(productId);
    }

    return (
        <div className="p-4 max-w-2xl mx-auto flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/spaces')}
                    className="text-sm text-blue-600 hover:underline"
                >
                    ← Volver
                </button>
                <h1 className="text-2xl font-bold">Productos</h1>
            </div>

            <CreateProductForm onSubmit={handleAdd} />

            {loading && <p className="text-gray-500">Cargando...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && products.length === 0 && (
                <p className="text-gray-400 text-sm">No hay productos en este space todavía.</p>
            )}

            <div className="flex flex-col gap-3">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onDelete={handleDelete}
                        canDelete={true}
                    />
                ))}
            </div>
        </div>
    );
}