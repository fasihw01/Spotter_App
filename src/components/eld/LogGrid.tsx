import React from 'react';
import type { Activity } from '../../types';

interface ELDLogGridProps {
    activities: Activity[];
    date: string;
    totals?: {
        off_duty: number;
        sleeper_berth: number;
        driving: number;
        on_duty_not_driving: number;
        [key: string]: number;
    };
}

const ELDLogGrid: React.FC<ELDLogGridProps> = ({ activities, date, totals }) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const statuses = [
        { key: 'off_duty', label: 'OFF DUTY' },
        { key: 'sleeper_berth', label: 'SLEEPER' },
        { key: 'driving', label: 'DRIVING' },
        { key: 'on_duty_not_driving', label: 'ON DUTY' }
    ];

    // Helper to get X position for a numerical hour (0-24)
    const getX = (hour: number) => {
        return (hour) * (100 / 24);
    };

    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[10px] md:text-xs">Daily Log: {date}</h3>
                    <p className="text-[10px] text-slate-400 font-medium lg:hidden mt-1">← Scroll horizontally to view full log →</p>
                </div>
                <div className="flex flex-wrap gap-3 md:gap-4">
                    {statuses.map(s => (
                        <div key={s.key} className="flex items-center gap-1.5">
                            <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm ${s.key === 'driving' ? 'bg-primary-500' :
                                s.key === 'on_duty_not_driving' ? 'bg-amber-500' :
                                    s.key === 'sleeper_berth' ? 'bg-emerald-500' : 'bg-slate-300'
                                }`}></div>
                            <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="relative lg:min-w-[700px] aspect-[4/1] border-2 border-slate-800 bg-slate-50 shadow-inner">
                    {/* Vertical Hour Lines */}
                    {hours.map(h => (
                        <div
                            key={h}
                            className="absolute top-0 bottom-0 border-l border-slate-300"
                            style={{ left: `${(h / 24) * 100}%` }}
                        >
                            <span className="absolute -bottom-6 left-0 -translate-x-1/2 text-[10px] font-bold text-slate-400">
                                {h === 0 ? 'M' : h === 12 ? 'N' : h > 12 ? h - 12 : h}
                            </span>
                        </div>
                    ))}
                    <div className="absolute top-0 bottom-0 right-0 border-l border-slate-300">
                        <span className="absolute -bottom-6 right-0 translate-x-1/2 text-[10px] font-bold text-slate-400">M</span>
                    </div>

                    {/* Horizontal Status Lines */}
                    <div className="flex flex-col h-full">
                        {statuses.map((s) => (
                            <div key={s.key} className="flex-1 relative border-b border-slate-200 last:border-0 group">
                                <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-16 text-[10px] font-bold text-slate-500 text-right pr-2">
                                    {s.label}
                                </div>

                                {/* Draw Log Activities for this status */}
                                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                                    {activities
                                        .filter(a => a.status === s.key)
                                        .map((a, idx) => {
                                            const x1 = getX(a.start_hour);
                                            const x2 = getX(a.end_hour);
                                            return (
                                                <React.Fragment key={idx}>
                                                    <line
                                                        x1={`${x1}%`}
                                                        y1="50%"
                                                        x2={`${x2}%`}
                                                        y2="50%"
                                                        stroke={
                                                            s.key === 'driving' ? '#0ea5e9' :
                                                                s.key === 'on_duty_not_driving' ? '#f59e0b' :
                                                                    s.key === 'sleeper_berth' ? '#10b981' : '#94a3b8'
                                                        }
                                                        strokeWidth="4"
                                                        strokeLinecap="round"
                                                        className="drop-shadow-sm"
                                                    />
                                                </React.Fragment>
                                            );
                                        })}
                                </svg>
                            </div>
                        ))}
                    </div>

                    {/* Vertical transitions (between statuses) */}
                    <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                        {activities.map((a, idx) => {
                            if (idx === 0) return null;
                            const prevActivity = activities[idx - 1];
                            const x = getX(a.start_hour);
                            const y1 = (statuses.findIndex(s => s.key === prevActivity.status) + 0.5) * (100 / 4);
                            const y2 = (statuses.findIndex(s => s.key === a.status) + 0.5) * (100 / 4);

                            return (
                                <line
                                    key={idx}
                                    x1={`${x}%`}
                                    y1={`${y1}%`}
                                    x2={`${x}%`}
                                    y2={`${y2}%`}
                                    stroke="#1e293b"
                                    strokeWidth="2"
                                    strokeDasharray="2 2"
                                    opacity="0.3"
                                />
                            );
                        })}
                    </svg>
                </div>
            </div>

            <div className="mt-10 md:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 pb-2">
                {statuses.map(s => {
                    const total = totals ? (totals as any)[s.key] : activities
                        .filter(a => a.status === s.key)
                        .reduce((acc, a) => acc + (a.end_hour - a.start_hour), 0);
                    return (
                        <div key={s.key} className="text-center bg-slate-50 rounded-xl p-2 md:p-3 border border-slate-100 shadow-sm">
                            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                            <p className="text-xs md:text-sm font-black text-slate-800">{total?.toFixed(2) || '0.00'}h</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ELDLogGrid;
