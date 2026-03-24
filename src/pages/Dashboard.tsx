import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Navigation, Map as MapIcon, Calendar, ArrowRight } from 'lucide-react';
import TripForm from '../components/TripForm';
import * as api from '../services/api';
import type { TripFormData, TripListItem } from '../types';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [recentTrips, setRecentTrips] = useState<TripListItem[]>([]);
    const [isFetchingTrips, setIsFetchingTrips] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecentTrips();
    }, []);

    const fetchRecentTrips = async () => {
        try {
            const data = await api.listTrips({ page_size: 5 });
            setRecentTrips(data.trips);
        } catch (error) {
            console.error('Failed to fetch recent trips:', error);
        } finally {
            setIsFetchingTrips(false);
        }
    };

    const handleTripSubmit = async (data: TripFormData) => {
        setIsLoading(true);
        try {
            const result = await api.calculateTrip(data);
            navigate(`/trip/${result.trip_id}`);
        } catch (error) {
            console.error('Trip calculation failed:', error);
            alert('Failed to calculate trip. Please check your inputs.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2 md:px-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 mt-1 text-sm">Ready to hit the road? Plan your route and ELD logs.</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm self-start md:self-auto">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                        70
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Cycle Remaining</p>
                        <p className="text-sm font-bold text-slate-800">70.0 Hours</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                                <Navigation size={20} className="md:hidden" />
                                <Navigation size={24} className="hidden md:block" />
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-slate-800">Plan a New Trip</h2>
                                <p className="text-xs md:text-sm text-slate-500 tracking-tight">Calculate stops, fueling, and HOS logs automatically.</p>
                            </div>
                        </div>
                        <TripForm onSubmit={handleTripSubmit} isLoading={isLoading} />
                    </div>
                </div>

                {/* Sidebar area: Recent Trips */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <History size={20} className="text-primary-500" />
                                Recent Trips
                            </h2>
                            <button 
                                onClick={() => navigate('/history')}
                                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                            >
                                View All
                            </button>
                        </div>

                        {isFetchingTrips ? (
                            <div className="space-y-4 py-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : recentTrips.length > 0 ? (
                            <div className="space-y-4">
                                {recentTrips.map((trip) => (
                                    <button
                                        key={trip.id}
                                        onClick={() => navigate(`/trip/${trip.id}`)}
                                        className="w-full group p-4 bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-slate-100 border border-transparent hover:border-slate-100 rounded-2xl transition-all duration-300 text-left"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                <Calendar size={12} />
                                                {new Date(trip.created_at).toLocaleDateString()}
                                            </div>
                                            <ArrowRight size={16} className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-800 truncate">{trip.dropoff_location}</p>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                From: {trip.current_location}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 px-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <MapIcon size={32} />
                                </div>
                                <p className="text-slate-400 font-medium tracking-tight">No trips calculated yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
