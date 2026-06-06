import { useState } from 'react';
import type { CreateProductInput } from '../types/product.types';

interface CreateProductFormProps {
    onSubmit: (input: CreateProductInput) => Promise<void>;
}

export function CreateProductForm({ onSubmit }: CreateProductFormProps) {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [minQuantity, setMinQuantity] = useState(1);
    const [unit, setUnit] = useState('unidad');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit() {
        if (!name.trim()) {
            setError('El nombre es requerido');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await onSubmit({ name, quantity, minQuantity, unit, notes: notes || undefined });
            setName('');
            setQuantity(0);
            setMinQuantity(1);
            setUnit('unidad');
            setNotes('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear producto');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="border rounded p-4 flex flex-col gap-3">
            <h2 className="font-semibold text-lg">Nuevo producto</h2>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <input
                type="text"
                placeholder="Nombre *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
            />
            <input
                type="number"
                placeholder="Cantidad"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded px-3 py-2 text-sm"
            />
            <input
                type="number"
                placeholder="Cantidad mínima"
                value={minQuantity}
                onChange={(e) => setMinQuantity(Number(e.target.value))}
                className="border rounded px-3 py-2 text-sm"
            />
            <input
                type="text"
                placeholder="Unidad (ej: kg, litros, unidad)"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
            />
            <input
                type="text"
                placeholder="Notas (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
            />

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white rounded px-4 py-2 text-sm disabled:opacity-50"
            >
                {loading ? 'Creando...' : 'Crear producto'}
            </button>
        </div>
    );
}