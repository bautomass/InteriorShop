// components/tracking/TrackingResults.tsx
'use client';
import { TrackingData } from '../../components/tracking/types/trackingTypes';

import {
    AlertCircle,
    ArrowRight,
    Box,
    ChevronDown,
    ChevronUp,
    Clock,
    MapPin,
    Package,
    PackageCheck,
    Truck
} from 'lucide-react';
import { useState } from 'react';

interface TrackingResultsProps {
  data: TrackingData;
}

export const TrackingResults = ({ data }: TrackingResultsProps) => {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const formatDate = (dateString: string, includeTime = true) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const getStatusInfo = (milestone: string) => {
    const statusMap = {
      delivered: {
        color: 'bg-[#6B5E4C]',
        icon: PackageCheck,
        text: 'text-[#6B5E4C]',
        bg: 'bg-[#EDE8E3]',
        border: 'border-[#B5A48B]'
      },
      in_transit: {
        color: 'bg-[#6B5E4C]',
        icon: Truck,
        text: 'text-[#6B5E4C]',
        bg: 'bg-[#EDE8E3]',
        border: 'border-[#B5A48B]'
      },
      pending: {
        color: 'bg-[#8C7E6A]',
        icon: Clock,
        text: 'text-[#8C7E6A]',
        bg: 'bg-[#EDE8E3]/50',
        border: 'border-[#B5A48B]/50'
      },
      exception: {
        color: 'bg-red-500',
        icon: AlertCircle,
        text: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-100'
      },
      out_for_delivery: {
        color: 'bg-[#6B5E4C]',
        icon: Truck,
        text: 'text-[#6B5E4C]',
        bg: 'bg-[#EDE8E3]',
        border: 'border-[#B5A48B]'
      }
    };

    return statusMap[milestone as keyof typeof statusMap] || statusMap.pending;
  };

  const visibleEvents = showAllEvents ? data.events : data.events.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#B5A48B]/20 overflow-hidden">
        <div className="bg-gradient-to-r from-[#6B5E4C] to-[#8C7E6A] p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Package className="w-6 h-6" />
                {data.trackingNumber}
              </h2>
              <p className="text-white/80 mt-1">
                {data.carrier.name && `Carrier: ${data.carrier.name}`}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-medium">{data.statusDetails}</span>
            </div>
          </div>
        </div>

        {/* Shipping Progress */}
        <div className="px-6 py-4 bg-[#EDE8E3]/20">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#EDE8E3] flex items-center justify-center">
                <Box className="w-4 h-4 text-[#6B5E4C]" />
              </div>
              <p className="text-xs text-[#8C7E6A] mt-1">Information Received</p>
            </div>
            <div className="flex-1 h-1 bg-[#EDE8E3] mx-2">
              <div 
                className={`h-full bg-[#6B5E4C] transition-all duration-500
                          ${data.currentMilestone === 'in_transit' ? 'w-1/2' : 
                            data.currentMilestone === 'delivered' ? 'w-full' : 'w-0'}`}
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#EDE8E3] flex items-center justify-center">
                <Truck className="w-4 h-4 text-[#6B5E4C]" />
              </div>
              <p className="text-xs text-[#8C7E6A] mt-1">In Transit</p>
            </div>
            <div className="flex-1 h-1 bg-[#EDE8E3] mx-2">
              <div 
                className={`h-full bg-[#6B5E4C] transition-all duration-500
                          ${data.currentMilestone === 'delivered' ? 'w-full' : 'w-0'}`}
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#EDE8E3] flex items-center justify-center">
                <PackageCheck className="w-4 h-4 text-[#6B5E4C]" />
              </div>
              <p className="text-xs text-[#8C7E6A] mt-1">Delivered</p>
            </div>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Route Information */}
          <div className="bg-[#EDE8E3]/20 rounded-xl p-4">
            <h3 className="text-sm font-medium text-[#6B5E4C] mb-4">Shipping Route</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6B5E4C]">
                  {data.origin.country || 'Origin'}
                </p>
                {data.origin.city && (
                  <p className="text-sm text-[#8C7E6A] mt-1">{data.origin.city}</p>
                )}
              </div>
              <ArrowRight className="w-5 h-5 text-[#8C7E6A] mx-4" />
              <div className="text-right">
                <p className="text-sm font-medium text-[#6B5E4C]">
                  {data.destination.country || 'Destination'}
                </p>
                {data.destination.city && (
                  <p className="text-sm text-[#8C7E6A] mt-1">{data.destination.city}</p>
                )}
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-[#EDE8E3]/20 rounded-xl p-4">
            <h3 className="text-sm font-medium text-[#6B5E4C] mb-4">Estimated Delivery</h3>
            {data.estimatedDelivery ? (
              <div className="text-sm">
                <p className="font-medium text-[#6B5E4C]">
                  {formatDate(data.estimatedDelivery.min, false)} - {formatDate(data.estimatedDelivery.max, false)}
                </p>
                {data.transitTime && (
                  <p className="text-[#8C7E6A] mt-1">
                    In transit for {data.transitTime.elapsed} days
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#8C7E6A]">Not available</p>
            )}
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#B5A48B]/20 p-6">
        <h3 className="text-lg font-medium text-[#6B5E4C] mb-6">Tracking History</h3>
        
        <div className="space-y-6">
          {visibleEvents.map((event, index) => {
            const statusInfo = getStatusInfo(event.milestone);
            const StatusIcon = statusInfo.icon;

            return (
              <div 
                key={event.eventId}
                className={`relative transition-all duration-300
                          ${expandedEvent === event.eventId ? 'bg-[#EDE8E3]/20 rounded-xl p-4' : ''}`}
              >
                <div className="relative flex items-start">
                  <div className={`mr-4 w-10 h-10 rounded-full ${statusInfo.color}
                                flex items-center justify-center flex-shrink-0`}>
                    <StatusIcon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="text-[#6B5E4C] font-medium">
                      {event.status}
                    </div>
                    <div className="mt-1 text-sm text-[#8C7E6A]">
                      {formatDate(event.timestamp)}
                    </div>
                    {event.location && (
                      <div className="mt-1 text-sm text-[#8C7E6A] flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    )}
                    
                    <button
                      onClick={() => setExpandedEvent(
                        expandedEvent === event.eventId ? null : event.eventId
                      )}
                      className="mt-2 text-sm text-[#6B5E4C] hover:text-[#8C7E6A]
                               flex items-center gap-1 transition-colors duration-200"
                    >
                      {expandedEvent === event.eventId ? (
                        <>Less details <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>More details <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                    
                    {expandedEvent === event.eventId && (
                      <div className="mt-3 text-sm text-[#8C7E6A] space-y-2 animate-fade-in">
                        <p>Carrier: {event.courier.name}</p>
                        <p>Status: {event.milestone}</p>
                        {event.description && <p>{event.description}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {data.events.length > 3 && (
          <button
            onClick={() => setShowAllEvents(!showAllEvents)}
            className="mt-6 w-full py-3 text-sm font-medium text-[#6B5E4C]
                     hover:text-[#8C7E6A] flex items-center justify-center gap-1
                     border-t border-[#B5A48B]/20 transition-colors duration-200"
          >
            {showAllEvents ? (
              <>Show Less <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Show All Events ({data.events.length}) <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};