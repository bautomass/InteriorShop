// app/track-order/page.tsx
'use client';

import { TrackingResults } from '@/components/tracking/TrackingResults';
import { Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { TrackingData } from '../../components/tracking/types/trackingTypes';

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingResult, setTrackingResult] = useState<TrackingData | null>(null);

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
      const response = await fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackingNumber: trackingNumber.trim() }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tracking information');
      }

      setTrackingResult(data);
      // Smooth scroll to results if found
      if (data) {
        window.scrollTo({ top: window.innerHeight * 0.4, behavior: 'smooth' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch tracking information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`${!trackingResult ? 'h-screen' : 'min-h-screen'} ${!trackingResult ? 'bg-[#FAF9F6]' : 'bg-gradient-to-b from-[#FAF9F6] to-white'}`}>
      <div className={`relative overflow-hidden bg-[#EDE8E3]/50 ${!trackingResult ? 'h-full flex items-center' : 'py-24'}`}>
        {/* Abstract background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-[#6B5E4C]/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-[#B5A48B]/5 rounded-full blur-3xl animate-pulse" 
               style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center ${!trackingResult ? 'py-8' : ''}">
            <div className="mb-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-[#6B5E4C] mb-4 tracking-tight">
                Track Your Order
              </h1>
              <p className="text-[#8C7E6A] text-lg max-w-2xl mx-auto">
                Enter your tracking number to receive instant updates on your shipment's journey
              </p>
            </div>

            {/* Search Form */}
            <div className="w-full max-w-2xl">
              <form onSubmit={handleSubmit} 
                    className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-2xl 
                             shadow-sm border border-[#B5A48B]/20
                             transition-all duration-300 hover:shadow-md">
                <div className="relative">
                  <label htmlFor="tracking-number" 
                         className="block text-[#6B5E4C] font-medium mb-2">
                    Tracking Number
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Search className={`w-5 h-5 text-[#8C7E6A] transition-opacity duration-300 
                                     ${loading ? 'opacity-0' : 'opacity-100'}`} />
                      {loading && (
                        <Loader2 className="w-5 h-5 text-[#6B5E4C] animate-spin absolute" />
                      )}
                    </div>
                    <input
                      type="text"
                      id="tracking-number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number..."
                      className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 
                               border-[#B5A48B]/20 rounded-xl text-[#6B5E4C] 
                               placeholder-[#8C7E6A]/50 focus:outline-none 
                               focus:border-[#6B5E4C] focus:ring-2 
                               focus:ring-[#6B5E4C]/20 transition-all duration-300
                               disabled:opacity-50"
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full bg-[#6B5E4C] text-white py-4 rounded-xl
                             hover:bg-[#5A4D3B] transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed
                             text-lg font-medium relative overflow-hidden
                             focus:outline-none focus:ring-2 
                             focus:ring-[#6B5E4C]/50 group"
                  >
                    <span className={`inline-flex items-center justify-center gap-2
                                   transition-all duration-300
                                   ${loading ? 'opacity-0' : 'opacity-100'}`}>
                      {loading ? 'Searching...' : 'Track Order'}
                      <Search className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    )}
                  </button>
                </div>
                {error && (
                  <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100
                                animate-fade-in">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section - Only render if there are results */}
      {trackingResult && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-fade-in">
            <TrackingResults data={trackingResult} />
          </div>
        </div>
      )}
    </main>
  );
}
