import { useSpaces } from '../hooks/useSpaces';
import { SpaceCard } from './SpaceCard';
import { CreateSpaceForm } from './CreateSpaceForm';
import { logout } from '../../auth/services/auth.service';
import { useNavigate } from 'react-router-dom';

export function SpacesPage() {
    const { spaces, loading, error, addSpace, removeSpace } = useSpaces();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-md mx-auto flex flex-col gap-6">

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">My Spaces</h1>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Sign out
                    </button>
                </div>

                <CreateSpaceForm onSuccess={addSpace} />

                {error && (
                    <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
                )}

                {loading ? (
                    <p className="text-sm text-gray-400 text-center">Loading spaces...</p>
                ) : spaces.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center">No spaces yet. Create your first one above.</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {spaces.map((space) => (
                            <SpaceCard key={space.id} space={space} onDelete={removeSpace} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}