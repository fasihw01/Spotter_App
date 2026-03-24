export interface TripFormData {
    current_location: string;
    pickup_location: string;
    dropoff_location: string;
    current_cycle_used: number;
}

export interface Activity {
    status: 'off_duty' | 'sleeper_berth' | 'driving' | 'on_duty_not_driving';
    start_hour: number;
    end_hour: number;
}

export interface Remark {
    time: string;
    status: string;
    text: string;
    location?: string;
}

export interface DailyLog {
    day: number;
    date: string;
    total_miles: number;
    totals: {
        off_duty: number;
        sleeper_berth: number;
        driving: number;
        on_duty_not_driving: number;
        [key: string]: number;
    };
    activities: Activity[];
    remarks: Remark[];
}

export interface RouteLeg {
    from: string;
    to: string;
    distance_miles: number;
    duration_hours: number;
    coordinates: [number, number][];
}

export interface Route {
    legs: RouteLeg[];
    total_miles: number;
    total_duration_hours: number;
}

export interface Summary {
    arrival_time: string;
    trip_completed: boolean;
    reason_for_stop?: string;
    total_miles: number;
    total_hours: number;
    total_days: number;
    total_driving_hours: number;
    total_duty_hours: number;
    total_rest_hours: number;
    cycle_hours_at_end: number;
    last_location?: string;
}

export interface TripEvent {
    status: string;
    clock: number;
    description: string;
    duration: number;
    location?: string;
    miles?: number;
}

export interface TripResult {
    route: Route;
    summary: Summary;
    daily_logs: DailyLog[];
    events: TripEvent[];
}

export interface SavedTrip {
    id: number | string;
    timestamp: number;
    formData: TripFormData;
    result: TripResult;
}

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user: User;
}

export interface PaginatedResponse<T> {
    results: T[];
    total_count: number;
    total_pages: number;
    current_page: number;
    has_next: boolean;
    has_previous: boolean;
}
