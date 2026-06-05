import { useState } from 'react';
import type { CreateSpaceInput } from '../types/space.types';

interface CreateSpaceFormProps {
    onSuccess: (input: CreateSpaceInput) => Promise<boolean>;
}

export function CreateSpaceForm({ onSuccess }: CreateSpaceFormProps) {
    const [form, setForm] = useState<CreateSpaceInput>({ name: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const success = await onSuccess(form);
        if (success) {
            setForm({ name: '', description: '' });
        } else {
            setError('Failed to create space');
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-gray-800">New Space</h2>

            {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
            )}

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700" htmlFor="name">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Kitchen, Garage, Cabin..."
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700" htmlFor="description">
                    Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="What do you store here?"
                    rows={2}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg py-2 text-sm transition-colors"
            >
                {loading ? 'Creating...' : 'Create space'}
            </button>
        </form>
    );
}