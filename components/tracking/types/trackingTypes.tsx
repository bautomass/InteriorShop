// types/tracking.ts

export interface CourierInfo {
  name: string;
  code: string;
}

export interface LocationInfo {
  country: string | null;
  postcode: string | null;
  city: string | null;
}

export interface TrackingEvent {
  eventId: string;
  status: string;
  timestamp: string;
  location: string | null;
  description: string;
  courier: CourierInfo;
  milestone: string;
  sourceCode: string;
}

export interface TrackingTimestamps {
  infoReceived: string | null;
  inTransit: string | null;
  outForDelivery: string | null;
  delivered: string | null;
}

export interface EstimatedDelivery {
  min: string;
  max: string;
}

export interface TransitTime {
  started: string;
  elapsed: number;
}

export interface TrackingData {
  trackingNumber: string;
  status: string;
  statusDetails: string;
  currentMilestone: string;
  events: TrackingEvent[];
  estimatedDelivery: EstimatedDelivery | null;
  carrier: CourierInfo;
  origin: LocationInfo;
  destination: LocationInfo;
  timestamps: TrackingTimestamps;
  transitTime: TransitTime | null;
}