// components/tracking/TrackingResults.tsx
import { CheckCircle2, Clock, Package, Truck } from 'lucide-react';

interface TrackingEvent {
  status: string;
  timestamp: string;
  location?: string;
  description?: string;
}

interface TrackingResult {
  trackingNumber: string;
  status: string;
  statusDetails: string;
  events: TrackingEvent[];
  estimatedDeliveryDate?: string;
  carrier?: string;
  originCountry?: string;
  destinationCountry?: string;
}

interface TrackingResultsProps {
  data: TrackingResult;
}

export const TrackingResults = ({ data }: TrackingResultsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm mt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#6B5E4C]">
          Order Status
        </h2>
        <span className="text-sm text-[#8C7E6A]">
          Tracking #: {data.trackingNumber}
        </span>
      </div>

      {/* Status Information */}
      <div className="mb-8 p-4 rounded-lg bg-[#EDE8E3]/30">
        <div className="flex items-center gap-3">
          {data.status === 'pending' ? (
            <Clock className="w-6 h-6 text-[#8C7E6A]" />
          ) : (
            <Package className="w-6 h-6 text-[#6B5E4C]" />
          )}
          <div>
            <h3 className="font-medium text-[#6B5E4C]">
              Current Status
            </h3>
            <p className="text-[#8C7E6A]">{data.statusDetails}</p>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      {data.events.length > 0 ? (
        <div className="relative mb-8">
          <div className="absolute left-[17px] top-0 h-full w-[2px] bg-[#B5A48B]/20" />
          
          {data.events.map((event, index) => (
            <div key={index} 
                 className="relative flex items-start mb-8 animate-slide-in"
                 style={{ animationDelay: `${index * 150}ms` }}>
              <div className={`absolute left-0 w-9 h-9 rounded-full ${
                index === 0 ? 'bg-[#6B5E4C]' : 'bg-[#B5A48B]'
              } flex items-center justify-center`}>
                {event.status.toLowerCase().includes('delivered') ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : event.status.toLowerCase().includes('transit') ? (
                  <Truck className="w-5 h-5 text-white" />
                ) : (
                  <Package className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="ml-16">
                <h3 className="text-[#6B5E4C] font-medium">{event.status}</h3>
                <p className="text-sm text-[#8C7E6A]">
                  {formatDate(event.timestamp)}
                </p>
                {event.location && (
                  <p className="text-sm text-[#8C7E6A]">
                    Location: {event.location}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[#8C7E6A]">
          No tracking events available yet. Please check back later.
        </div>
      )}

      {/* Delivery Information */}
      <div className="mt-8 pt-8 border-t border-[#B5A48B]/20">
        <h3 className="text-[#6B5E4C] font-medium mb-4">
          Delivery Information
        </h3>
        <div className="space-y-2 text-sm text-[#8C7E6A]">
          <p>Tracking Number: {data.trackingNumber}</p>
          {data.carrier && (
            <p>Carrier: {data.carrier}</p>
          )}
          {data.estimatedDeliveryDate && (
            <p>Estimated Delivery: {formatDate(data.estimatedDeliveryDate)}</p>
          )}
          {(data.originCountry || data.destinationCountry) && (
            <p>
              Route: {data.originCountry || 'Unknown'} → {data.destinationCountry || 'Unknown'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};