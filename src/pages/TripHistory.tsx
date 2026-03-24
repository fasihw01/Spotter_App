import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, Trash2, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import * as api from '../services/api';
import type { TripListItem } from '../types';

const TripHistory = () => {
    const [trips, setTrips] = useState<TripListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        setIsLoading(true);
        try {
            const data = await api.listTrips();
            setTrips(data.trips);
        } catch (error) {
            console.error('Failed to fetch trips:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this trip record?')) {
            try {
                await api.deleteTrip(id);
                setTrips(trips.filter(t => t.id !== id));
            } catch (error) {
                console.error('Failed to delete trip:', error);
                alert('Failed to delete trip.');
            }
        }
    };

    const filteredTrips = trips.filter(trip => 
        trip.pickup_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.dropoff_location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                        <History className="text-primary-600" size={32} />
                        Trip History
                    </h1>
                    <p className="text-slate-500 mt-1">Review and manage your past trip calculations and logs.</p>
                </div>
                
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search trips..."
                        className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="animate-spin text-primary-600" size={40} />
                    <p className="text-slate-500 font-medium tracking-tight">Loading your history...</p>
                </div>
            ) : filteredTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTrips.map((trip) => (
                        <div
                            key={trip.id}
                            onClick={() => navigate(`/trip/${trip.id}`)}
                            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-slate-200/60 hover:border-primary-100 transition-all group flex flex-col justify-between cursor-pointer"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                                        <Calendar size={12} className="text-primary-500" />
                                        {new Date(trip.created_at).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, trip.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="space-y-4 relative">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Pickup</p>
                                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{trip.pickup_location}</p>
                                        </div>
                                    </div>
                                    <div className="absolute left-1 top-4 bottom-4 w-[2px] bg-slate-100 border-l-2 border-dashed border-slate-100"></div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Dropoff</p>
                                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{trip.dropoff_location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="text-sm font-bold text-primary-600 transition-all flex items-center gap-1 group-hover:translate-x-1">
                                    View Logistics <ArrowRight size={16} />
                                </div>
                                <div className="text-xs font-bold text-slate-400">
                                    {Math.round(trip.total_miles)} miles
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-20 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 ring-8 ring-slate-50/50">
                        <History size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No trips found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">
                        {searchQuery ? "We couldn't find any trips matching your search." : "Start by calculating your first trip on the dashboard."}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-8 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-100"
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default TripHistory;
