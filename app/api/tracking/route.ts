// app/api/tracking/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface TrackingEvent {
  status: string;
  timestamp: string;
  location?: string;
  description?: string;
}

interface TrackingResponse {
  trackingNumber: string;
  status: string;
  statusDetails: string;
  events: TrackingEvent[];
  estimatedDeliveryDate?: string;
  carrier?: string;
  originCountry?: string;
  destinationCountry?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { trackingNumber } = await request.json();
    console.log('Received tracking number:', trackingNumber);

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SHIP24_TRACKING_ACCESS_TOKEN;
    if (!apiKey) {
      console.error('API key is missing from environment variables');
      return NextResponse.json(
        { error: 'API configuration is missing' },
        { status: 500 }
      );
    }

    // Create tracker
    console.log('Creating tracker...');
    const createTrackerResponse = await fetch('https://api.ship24.com/public/v1/trackers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        trackingNumber: trackingNumber
      })
    });

    const createTrackerData = await createTrackerResponse.json();
    console.log('Create tracker response:', createTrackerData);

    if (!createTrackerResponse.ok) {
      console.error('Failed to create tracker:', createTrackerData);
      return NextResponse.json(
        { 
          error: 'Failed to create tracker',
          details: createTrackerData.message || 'Unknown error'
        },
        { status: createTrackerResponse.status }
      );
    }

    const trackerId = createTrackerData.data?.tracker?.trackerId;
    console.log('Tracker ID:', trackerId);

    if (!trackerId) {
      console.error('No tracker ID in response:', createTrackerData);
      return NextResponse.json(
        { error: 'Invalid tracker response' },
        { status: 500 }
      );
    }

    // Wait a moment for initial tracking data
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get tracking results
    console.log('Fetching tracking results...');
    const trackingResponse = await fetch(`https://api.ship24.com/public/v1/trackers/${trackerId}/results`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    const trackingData = await trackingResponse.json();
    console.log('Tracking results:', JSON.stringify(trackingData, null, 2));

    if (!trackingResponse.ok) {
      console.error('Failed to fetch tracking details:', trackingData);
      return NextResponse.json(
        { error: trackingData.message || 'Failed to fetch tracking details' },
        { status: trackingResponse.status }
      );
    }

    const tracking = trackingData.data?.trackings?.[0];
    if (!tracking) {
      return NextResponse.json(
        { error: 'No tracking information found' },
        { status: 404 }
      );
    }

    // Get a more descriptive status
    let statusDetails = 'Tracking number registered';
    if (tracking.shipment?.statusMilestone === 'pending') {
      statusDetails = 'Tracking information pending - please check back in a few minutes';
    } else if (tracking.events && tracking.events.length > 0) {
      statusDetails = tracking.events[0].status;
    }

    // Format the response
    const formattedResponse: TrackingResponse = {
      trackingNumber: tracking.tracker.trackingNumber,
      status: tracking.shipment?.statusMilestone || 'unknown',
      statusDetails: statusDetails,
      events: (tracking.events || []).map((event: any) => ({
        status: event.status,
        timestamp: event.occurrenceDatetime,
        location: event.location,
        description: event.status
      })),
      estimatedDeliveryDate: tracking.shipment?.delivery?.estimatedDeliveryDate,
      carrier: tracking.shipment?.courier?.name,
      originCountry: tracking.shipment?.originCountryCode,
      destinationCountry: tracking.shipment?.destinationCountryCode
    };

    console.log('Formatted response:', JSON.stringify(formattedResponse, null, 2));
    return NextResponse.json(formattedResponse);

  } catch (error) {
    console.error('Error processing tracking request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process tracking request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}