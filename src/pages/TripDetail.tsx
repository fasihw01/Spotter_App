import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Navigation,
    Map as MapIcon,
    FileText,
    Fuel,
    Coffee,
    CheckCircle2,
    Calendar,
    Loader2
} from 'lucide-react';
import * as api from '../services/api';
import type { SavedTrip } from '../types';
import Map from '../components/Map';
import LogGrid from '../components/eld/LogGrid';

const TripDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<SavedTrip | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'map' | 'logs'>('map');
    const navigate = useNavigate();

    useEffect(() => {
        if (id) fetchTripDetail(id);
    }, [id]);

    const fetchTripDetail = async (tripId: string) => {
        try {
            const data = await api.getTripDetail(tripId);
            setTrip(data);
        } catch (error) {
            console.error('Failed to fetch trip detail:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="animate-spin text-primary-600" size={44} />
                <p className="text-slate-500 font-bold tracking-tight animate-pulse">Calculating Logistics...</p>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Trip Not Found</h2>
                <p className="text-slate-500 mt-2">The trip you're looking for doesn't exist or has been deleted.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-8 px-6 py-3 bg-primary-600 text-white font-bold rounded-2xl"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 md:px-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 md:p-3 bg-white border border-slate-100 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-600 hover:text-primary-600"
                    >
                        <ChevronLeft size={20} className="md:hidden" />
                        <ChevronLeft size={24} className="hidden md:block" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Trip Details</h1>
                            <span className="bg-primary-50 text-primary-700 text-[9px] md:text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border border-primary-100">
                                #{trip.id}
                            </span>
                        </div>
                        <p className="text-slate-500 text-xs md:text-sm font-medium flex items-center gap-1.5 md:gap-2">
                            <Calendar size={12} className="md:hidden text-primary-400" />
                            <Calendar size={14} className="hidden md:block text-primary-400" />
                            <span className="md:hidden">Planned {trip.timestamp ? new Date(trip.timestamp).toLocaleDateString() : 'N/A'}</span>
                            <span className="hidden md:inline">Planned on {trip.timestamp ? new Date(trip.timestamp).toLocaleDateString() : 'N/A'}</span>
                        </p>
                    </div>
                </div>
            </header>

            <div className="flex flex-col space-y-8 animate-in fade-in duration-700">
                {/* Row 1: Route Overview - Full Width */}
                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex-1">
                            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-3 text-base md:text-lg uppercase tracking-tight">
                                <Navigation size={22} className="text-primary-500" />
                                Route Overview
                            </h3>

                            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 relative">
                                <div className="absolute left-3 md:left-auto md:top-1/2 md:translate-y-[-50%] top-8 bottom-8 md:w-full md:h-[2px] w-[2px] bg-slate-100 border-l-2 md:border-l-0 md:border-t-2 border-dashed border-slate-200 -z-0"></div>

                                <div className="relative z-10 bg-white pr-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-emerald-50 shadow-md shrink-0"></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin</p>
                                            <p className="font-bold text-slate-800 text-sm md:text-base">{trip.formData.current_location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 bg-white px-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full bg-orange-500 ring-4 ring-orange-50 shadow-md shrink-0"></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup</p>
                                            <p className="font-bold text-slate-800 text-sm md:text-base">{trip.formData.pickup_location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 bg-white pl-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full bg-red-500 ring-4 ring-red-50 shadow-md shrink-0"></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                                            <p className="font-bold text-slate-800 text-sm md:text-base">{trip.formData.dropoff_location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 md:gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                            <div className="bg-primary-50 px-6 py-4 rounded-2xl border border-primary-100 text-center min-w-[120px]">
                                <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wider mb-1">Total Distance</p>
                                <p className="text-xl md:text-2xl font-black text-primary-700">{Math.round(trip.result.route.total_miles)} <span className="text-xs font-bold opacity-60">mi</span></p>
                            </div>
                            <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 text-center min-w-[120px]">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Duration</p>
                                <p className="text-xl md:text-2xl font-black text-slate-800">{Math.round(trip.result.route.total_duration_hours)} <span className="text-xs font-bold opacity-60">hr</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: Planned Events - Full Width */}
                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                    <h3 className="font-black text-slate-800 mb-8 text-base md:text-lg uppercase tracking-tight">Planned Events & Logistics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {trip.result.events.map((event, idx) => (
                            <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100 group">
                                <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${event.status === 'driving' ? 'bg-blue-50 text-blue-600' :
                                    event.status.includes('rest') || event.status.includes('sleeper') ? 'bg-emerald-50 text-emerald-600' :
                                        'bg-orange-50 text-orange-600'
                                    }`}>
                                    {event.status === 'driving' ? <Navigation size={22} /> :
                                        event.status.includes('rest') || event.status.includes('sleeper') ? <Coffee size={22} /> :
                                            <Fuel size={22} />}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-slate-800 text-sm capitalize truncate mb-0.5">{event.status.replace(/_/g, ' ')}</p>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2 font-medium">{event.description}</p>
                                    <div className="inline-flex px-2 py-0.5 bg-white border border-slate-100 rounded-lg shadow-sm">
                                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-wider">
                                            {event.duration >= 1 ? `${event.duration.toFixed(1)} HR` : `${Math.round(event.duration * 60)} MIN`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Row 3: View Switcher - Full Width */}
                <div className="flex flex-col sm:flex-row items-center justify-start gap-4 p-2 rounded-[2rem] border border-slate-200/50">
                    <button
                        onClick={() => setActiveTab('map')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'map'
                            ? 'bg-slate-900 text-white shadow-xl shadow-slate-400/20 scale-105'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                            }`}
                    >
                        <MapIcon size={20} />
                        Interactive Map View
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'logs'
                            ? 'bg-slate-900 text-white shadow-xl shadow-slate-400/20 scale-105'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                            }`}
                    >
                        <FileText size={20} />
                        ELD Digital Logs
                    </button>
                </div>

                {/* Row 4: Main Content View - Full Width */}
                <div className="min-h-[500px] md:min-h-[700px] h-[70vh] animate-in zoom-in-95 duration-500">
                    {activeTab === 'map' ? (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 h-full overflow-hidden">
                            <Map route={trip.result.route} />
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {trip.result.daily_logs.map((log, idx) => (
                                <div key={idx} className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b border-slate-50 pb-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-primary-600 text-white rounded-3xl flex items-center justify-center font-black text-xl shadow-lg shadow-primary-200">
                                                D{idx + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">Daily Driving Log</h3>
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">{log.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-8">
                                            <div className="bg-slate-50 px-6 py-3 rounded-2xl">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Driving</p>
                                                <p className="font-black text-primary-600 text-xl">{log.totals.driving.toFixed(1)}h</p>
                                            </div>
                                            <div className="bg-slate-50 px-6 py-3 rounded-2xl">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">On-Duty</p>
                                                <p className="font-black text-amber-600 text-xl">{(log.totals.on_duty_not_driving + log.totals.driving).toFixed(1)}h</p>
                                            </div>
                                        </div>
                                    </div>

                                    <LogGrid activities={log.activities} date={log.date} totals={log.totals} />

                                    <div className="mt-10 p-6 bg-gradient-to-r from-emerald-50 to-white rounded-2xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="lg:w-10 lg:h-10 bg-emerald-500 text-white rounded-full flex lg:items-center items-start justify-center shadow-lg shadow-emerald-200">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <p className="font-black text-slate-700 uppercase tracking-tight text-sm">Compliant with 70hr/8day Federal HOS Rules</p>
                                        </div>
                                        <p className="text-xs text-emerald-600 font-bold italic bg-white px-4 py-2 rounded-xl border border-emerald-50">Log generated for property-carrying driver</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default TripDetail;
