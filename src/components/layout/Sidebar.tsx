import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, LogOut, Navigation as SteeringWheel } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/history', icon: History, label: 'Trip History' },
    ];

    return (
        <aside className={cn(
            "w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-[60] transition-transform duration-300 lg:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-600 p-2 rounded-lg text-white">
                        <SteeringWheel size={24} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-800">Spotter</h1>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <LogOut size={20} className="rotate-180" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onClose}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                            isActive 
                                ? "bg-primary-50 text-primary-600 font-medium" 
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <item.icon size={20} className={cn(
                            "transition-colors",
                            "group-hover:text-primary-500"
                        )} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-slate-100">
                <div className="flex items-center gap-3 px-4 py-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                        {user?.username?.[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{user?.username}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
