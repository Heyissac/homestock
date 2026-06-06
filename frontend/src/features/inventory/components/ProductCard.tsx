import type { Product } from '../types/product.types';

interface ProductCardProps {
    product: Product;
    onDelete: (id: string) => void;
    canDelete: boolean;
}

export function ProductCard({ product, onDelete, canDelete }: ProductCardProps) {
    const isLowStock = product.quantity <= product.minQuantity;

    return (
        <div className="border rounded p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    {product.category && (
                        <span className="text-xs text-gray-500">{product.category.name}</span>
                    )}
                </div>
                {canDelete && (
                    <button
                        onClick={() => onDelete(product.id)}
                        className="text-red-500 text-sm hover:underline"
                    >
                        Eliminar
                    </button>
                )}
            </div>

            <div className="flex gap-4 text-sm">
                <span>
                    Cantidad:{' '}
                    <span className={isLowStock ? 'text-red-500 font-bold' : 'font-medium'}>
                        {product.quantity} {product.unit}
                    </span>
                </span>
                <span className="text-gray-500">Mínimo: {product.minQuantity} {product.unit}</span>
            </div>

            {isLowStock && (
                <span className="text-xs text-red-500 font-medium">⚠ Stock bajo</span>
            )}

            {product.notes && (
                <p className="text-xs text-gray-500">{product.notes}</p>
            )}
        </div>
    );
}