import { useState } from 'react';
import type { CreateCategoryInput } from '../types/category.types';

interface CreateCategoryFormProps {
    onSubmit: (input: CreateCategoryInput) => Promise<void>;
}

export function CreateCategoryForm({ onSubmit }: CreateCategoryFormProps) {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
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
            await onSubmit({ name, icon: icon || undefined });
            setName('');
            setIcon('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear categoría');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="border rounded p-4 flex flex-col gap-3">
            <h2 className="font-semibold text-lg">Nueva categoría</h2>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <input
                type="text"
                placeholder="Nombre *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
            />
            <input
                type="text"
                placeholder="Ícono (emoji, opcional)"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
            />

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white rounded px-4 py-2 text-sm disabled:opacity-50"
            >
                {loading ? 'Creando...' : 'Crear categoría'}
            </button>
        </div>
    );
}