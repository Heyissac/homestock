import type { Space } from '../types/space.types';

interface SpaceCardProps {
    space: Space;
    onDelete: (id: string) => void;
    onNavigate: (spaceId: string) => void;
}

export function SpaceCard({ space, onDelete, onNavigate }: SpaceCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-800">{space.name}</h2>
                    {space.description && (
                        <p className="text-sm text-gray-500 mt-0.5">{space.description}</p>
                    )}
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                    {space.role}
                </span>
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={() => onNavigate(space.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                    Ver productos →
                </button>

                {space.role === 'OWNER' && (
                    <button
                        onClick={() => onDelete(space.id)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}