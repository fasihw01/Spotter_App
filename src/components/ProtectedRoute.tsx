import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './layout/Sidebar';
import { Menu } from 'lucide-react';

const ProtectedRoute = () => {
    const { token, isLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex bg-slate-50 min-h-screen relative">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-primary-600 p-1.5 rounded-lg text-white">
                        <Menu size={20} onClick={() => setIsSidebarOpen(true)} className="cursor-pointer" />
                    </div>
                    <span className="font-bold text-slate-800">Spotter</span>
                </div>
            </header>

            {/* Sidebar with overlay on mobile */}
            <>
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 lg:hidden transition-all duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </>

            <main className="flex-1 lg:ml-64 p-4 md:p-8 mt-16 lg:mt-0 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ProtectedRoute;
