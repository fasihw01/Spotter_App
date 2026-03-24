import { useState } from 'react';
import { MapPin, Clock, Navigation, Loader2 } from 'lucide-react';
import type { TripFormData } from '../types';

interface TripFormProps {
    onSubmit: (data: TripFormData) => Promise<void>;
    isLoading: boolean;
}

const PRESETS = [
    {
        id: 'short',
        label: 'Short Route',
        description: 'LA to Phoenix',
        data: {
            current_location: 'Los Angeles, CA',
            pickup_location: 'Los Angeles, CA',
            dropoff_location: 'Phoenix, AZ',
            current_cycle_used: 10.5
        }
    },
    {
        id: 'mid',
        label: 'Mid Route',
        description: 'Phoenix to Dallas',
        data: {
            current_location: 'Phoenix, AZ',
            pickup_location: 'Phoenix, AZ',
            dropoff_location: 'Dallas, TX',
            current_cycle_used: 15.5
        }
    },
    {
        id: 'long',
        label: 'Long Route',
        description: 'LA to Dallas',
        data: {
            current_location: 'Los Angeles, CA',
            pickup_location: 'San Bernardino, CA',
            dropoff_location: 'Dallas, TX',
            current_cycle_used: 20.0
        }
    }
];

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<TripFormData>({
        current_location: '',
        pickup_location: '',
        dropoff_location: '',
        current_cycle_used: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: TripFormData) => ({
            ...prev,
            [name]: name === 'current_cycle_used' ? parseFloat(value) || 0 : value
        }));
    };

    const handlePreset = (data: TripFormData) => {
        setFormData(data);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 block">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => handlePreset(preset.data)}
                            className="px-3 py-2 bg-white border border-slate-200 hover:border-primary-500 hover:text-primary-600 rounded-lg text-xs font-medium transition-all shadow-sm flex flex-col items-start gap-0.5"
                        >
                            <span>{preset.label}</span>
                            <span className="text-[10px] text-slate-500 font-normal">{preset.description}</span>
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => handlePreset({
                            current_location: '',
                            pickup_location: '',
                            dropoff_location: '',
                            current_cycle_used: 0,
                        })}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-all"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <MapPin size={16} className="text-primary-500" />
                        Current Location
                    </label>
                    <input
                        type="text"
                        name="current_location"
                        required
                        placeholder="e.g. Los Angeles, CA"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-900"
                        value={formData.current_location}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Navigation size={16} className="text-emerald-500" />
                        Pickup Location
                    </label>
                    <input
                        type="text"
                        name="pickup_location"
                        required
                        placeholder="e.g. Phoenix, AZ"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-900"
                        value={formData.pickup_location}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <MapPin size={16} className="text-red-500" />
                        Dropoff Location
                    </label>
                    <input
                        type="text"
                        name="dropoff_location"
                        required
                        placeholder="e.g. Dallas, TX"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-900"
                        value={formData.dropoff_location}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Clock size={16} className="text-blue-500" />
                        Current Cycle Used (Hrs)
                    </label>
                    <input
                        type="number"
                        name="current_cycle_used"
                        required
                        min="0"
                        max="70"
                        step="0.1"
                        placeholder="e.g. 15.5"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-900"
                        value={formData.current_cycle_used}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-200 transition-all active:scale-[0.98] disabled:opacity-70"
            >
                {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    <>
                        <Navigation size={20} />
                        Calculate Route & Logs
                    </>
                )}
            </button>
        </form>
    );
};

export default TripForm;
