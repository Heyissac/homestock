import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { ProductCard } from './ProductCard';
import { CreateProductForm } from './CreateProductForm';
import { CreateCategoryForm } from './CreateCategoryForm';
import type { CreateProductInput } from '../types/product.types';
import type { CreateCategoryInput } from '../types/category.types';

export function ProductsPage() {
    const { spaceId } = useParams<{ spaceId: string }>();
    const navigate = useNavigate();
    const { products, loading: loadingProducts, error: errorProducts, addProduct, removeProduct } = useProducts(spaceId!);
    const { categories, loading: loadingCategories, addCategory } = useCategories(spaceId!);

    async function handleAddProduct(input: CreateProductInput) {
        await addProduct(input);
    }

    async function handleDeleteProduct(productId: string) {
        await removeProduct(productId);
    }

    async function handleAddCategory(input: CreateCategoryInput) {
        await addCategory(input);
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

            <CreateCategoryForm onSubmit={handleAddCategory} />

            <CreateProductForm
                onSubmit={handleAddProduct}
                categories={categories}
            />

            {(loadingProducts || loadingCategories) && <p className="text-gray-500">Cargando...</p>}
            {errorProducts && <p className="text-red-500">{errorProducts}</p>}

            {!loadingProducts && products.length === 0 && (
                <p className="text-gray-400 text-sm">No hay productos en este space todavía.</p>
            )}

            <div className="flex flex-col gap-3">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onDelete={handleDeleteProduct}
                        canDelete={true}
                    />
                ))}
            </div>
        </div>
    );
}