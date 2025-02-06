// app/track-order/page.tsx
'use client';

import { Globe } from '@/components/tracking/Globe';
import { TrackingResults } from '@/components/tracking/TrackingResults';
import { useState } from 'react';

interface TrackingEvent {
  status: string;
  timestamp: string;
  location?: string;
  description?: string;
}

interface TrackingResult {
  trackingNumber: string;
  status: string;
  events: TrackingEvent[];
  estimatedDeliveryDate?: string;
  carrier?: string;
}

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Submitting tracking number:', trackingNumber);
      
      const response = await fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackingNumber: trackingNumber.trim() }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error response:', data);
        throw new Error(data.error || 'Failed to fetch tracking information');
      }

      console.log('Tracking response:', data);
      setTrackingResult(data);
    } catch (err) {
      console.error('Tracking error:', err);
      setError(err instanceof Error ? err.message : 'Unable to fetch tracking information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <div className="w-full bg-[#EDE8E3] py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#6B5E4C] text-center">
            Track Your Order
          </h1>
          <p className="mt-4 text-center text-[#8C7E6A]">
            Enter your tracking number to see real-time status and delivery updates
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Animation */}
          <div className="hidden lg:block relative min-h-[400px]">
            <div className="sticky top-8">
              <Globe isLoading={loading} />
            </div>
          </div>

          {/* Right Column - Form and Results */}
          <div>
            {/* Tracking Form */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
              <div className="mb-6">
                <label htmlFor="trackingNumber" 
                       className="block text-[#6B5E4C] font-medium mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter your tracking number"
                  className="w-full px-4 py-4 rounded-md border border-[#B5A48B]/20 
                           focus:outline-none focus:border-[#6B5E4C] 
                           bg-white/50 text-[#6B5E4C] placeholder-[#8C7E6A]/50
                           text-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6B5E4C] text-white py-4 rounded-md 
                         hover:bg-[#5A4D3B] transition-colors duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         text-lg font-medium"
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
              {error && (
                <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
              )}
            </form>

            {/* Tracking Results */}
            {trackingResult && <TrackingResults data={trackingResult} />}
          </div>
        </div>
      </div>
    </main>
  );
}