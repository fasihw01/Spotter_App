import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Route } from '../types';
import { motion } from 'framer-motion';
import {MapPin, Package, Flag } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix Leaflet default icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;

const createIcon = (color: string, icon: React.ReactElement) => {
    const iconHtml = renderToStaticMarkup(icon);
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background:${color};width:36px;height:36px;border-radius:12px;
           display:flex;align-items:center;justify-content:center;
           border:3px solid white;box-shadow:0 8px 16px rgba(0,0,0,0.15);">
           ${iconHtml}
           </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
};

const currentIcon = createIcon('#2F80ED', <MapPin className="w-5 h-5 text-white" />);
const pickupIcon = createIcon('#27AE60', <Package className="w-5 h-5 text-white" />);
const dropoffIcon = createIcon('#219653', <Flag className="w-5 h-5 text-white" />);


interface FitBoundsProps {
    coordinates: [number, number][];
}

const FitBounds = ({ coordinates }: FitBoundsProps) => {
    const map = useMap();
    useEffect(() => {
        if (coordinates && coordinates.length > 0) {
            // Leaflet expects [lat, lng], backend gives [lng, lat]
            const latLngs = coordinates.map((c) => [c[1], c[0]] as [number, number]);
            const bounds = L.latLngBounds(latLngs);
            map.fitBounds(bounds, { padding: [80, 80] });
        }
    }, [coordinates, map]);
    return null;
};

interface MapProps {
    route: Route | null;
}

const Map = ({ route }: MapProps) => {
    if (!route || !route.legs) return null;

    const allCoords = route.legs.flatMap((leg) => leg.coordinates || []);
    const routeLatLngs = allCoords.map((c) => [c[1], c[0]] as [number, number]);

    const leg1 = route.legs[0];
    const leg2 = route.legs[1] || route.legs[0]; // Fallback if only 1 leg

    const currentPos = leg1?.coordinates?.[0] ? [leg1.coordinates[0][1], leg1.coordinates[0][0]] as [number, number] : null;
    const pickupPos = route.legs.length > 1 && route.legs[1]?.coordinates?.[0]
        ? [route.legs[1].coordinates[0][1], route.legs[1].coordinates[0][0]] as [number, number]
        : null;

    // Last coordinate of the last leg
    const lastLeg = route.legs[route.legs.length - 1];
    const dropoffPos = lastLeg?.coordinates?.length
        ? [lastLeg.coordinates[lastLeg.coordinates.length - 1][1], lastLeg.coordinates[lastLeg.coordinates.length - 1][0]] as [number, number]
        : null;

    const center = routeLatLngs.length > 0 ? routeLatLngs[0] : [39.8283, -98.5795] as [number, number];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden h-full flex flex-col"
        >

            <div className="flex-1 relative">
                <MapContainer center={center} zoom={6} className="h-full w-full">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <FitBounds coordinates={allCoords} />

                    {routeLatLngs.length > 1 && (
                        <Polyline
                            positions={routeLatLngs}
                            pathOptions={{
                                color: "#2F80ED",
                                weight: 5,
                                opacity: 0.8,
                                lineJoin: 'round'
                            }}
                        />
                    )}

                    {currentPos && (
                        <Marker position={currentPos} icon={currentIcon}>
                            <Popup className="custom-popup">
                                <div className="p-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current State</p>
                                    <p className="text-sm font-bold text-slate-800">{leg1.from}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                    {pickupPos && (
                        <Marker position={pickupPos} icon={pickupIcon}>
                            <Popup className="custom-popup">
                                <div className="p-1">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Pickup Point</p>
                                    <p className="text-sm font-bold text-slate-800">{leg2.from}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                    {dropoffPos && (
                        <Marker position={dropoffPos} icon={dropoffIcon}>
                            <Popup className="custom-popup">
                                <div className="p-1">
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Destination</p>
                                    <p className="text-sm font-bold text-slate-800">{lastLeg.to}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>

                {/* Float Legend */}
                <div className="absolute bottom-6 left-6 z-[1000] bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-xl flex gap-6 border border-white/50">
                    <LegendItem dot="bg-blue-500" label="Current" />
                    <LegendItem dot="bg-emerald-500" label="Pickup" />
                    <LegendItem dot="bg-emerald-600" label="Final" />
                </div>
            </div>
        </motion.div>
    );
};

const LegendItem = ({ dot, label }: { dot: string, label: string }) => (
    <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${dot} shadow-sm shadow-black/10`} />
        <span className="text-[10px] font-black tracking-widest uppercase text-slate-600">{label}</span>
    </div>
);

export default Map;
