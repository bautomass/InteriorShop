// app/api/tracking/route.ts
import { NextRequest, NextResponse } from 'next/server';

const CARRIER_CODES = {
  'nl-post': {
    name: 'PostNL',
    country: 'Netherlands',
    estimatedDays: { min: 3, max: 7 }
  },
  'cn-post': {
    name: 'China Post',
    country: 'China',
    estimatedDays: { min: 14, max: 30 }
  },
  'usps': {
    name: 'USPS',
    country: 'United States',
    estimatedDays: { min: 2, max: 5 }
  }
};

const calculateEstimatedDelivery = (
  timestamp: string,
  courierCode: string
) => {
  const carrierInfo = CARRIER_CODES[courierCode as keyof typeof CARRIER_CODES];
  if (!carrierInfo) return null;

  const startDate = new Date(timestamp);
  const minDate = new Date(startDate);
  const maxDate = new Date(startDate);

  minDate.setDate(startDate.getDate() + carrierInfo.estimatedDays.min);
  maxDate.setDate(startDate.getDate() + carrierInfo.estimatedDays.max);

  return {
    min: minDate.toISOString(),
    max: maxDate.toISOString()
  };
};

export async function POST(request: NextRequest) {
  try {
    const { trackingNumber } = await request.json();
    console.log('Processing tracking request for:', trackingNumber);

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SHIP24_TRACKING_ACCESS_TOKEN;
    if (!apiKey) {
      console.error('API key missing from environment variables');
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      );
    }

    // Step 1: Create tracking request
    console.log('Initializing tracking request...');
    const createResponse = await fetch('https://api.ship24.com/public/v1/trackers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trackingNumber })
    });

    const createData = await createResponse.json();
    
    if (!createResponse.ok) {
      console.error('Tracking creation failed:', createData);
      return NextResponse.json(
        { error: createData.message || 'Failed to initialize tracking' },
        { status: createResponse.status }
      );
    }

    // Step 2: Fetch tracking results
    console.log('Retrieving tracking information...');
    const trackingUrl = `https://api.ship24.com/public/v1/trackers/search/${encodeURIComponent(trackingNumber)}/results`;
    
    const trackingResponse = await fetch(trackingUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    const trackingData = await trackingResponse.json();

    if (!trackingResponse.ok) {
      console.error('Tracking retrieval failed:', trackingData);
      return NextResponse.json(
        { error: 'Unable to retrieve tracking information' },
        { status: trackingResponse.status }
      );
    }

    const tracking = trackingData.data?.trackings?.[0];
    
    if (!tracking) {
      return NextResponse.json(
        { error: 'No tracking information available' },
        { status: 404 }
      );
    }

    // Process event data
    const events = tracking.events || [];
    const latestEvent = events[0];
    const firstEvent = events[events.length - 1];
    const courierCode = latestEvent?.courierCode;

    // Calculate estimated delivery if not provided
    const estimatedDelivery = tracking.shipment?.delivery?.estimatedDeliveryDate ||
      (firstEvent && courierCode ? 
        calculateEstimatedDelivery(firstEvent.occurrenceDatetime, courierCode) : 
        null);

    // Format the response
    const formattedResponse = {
      trackingNumber,
      status: tracking.shipment?.statusCode || 'pending',
      statusDetails: latestEvent?.status || 'Tracking initiated',
      currentMilestone: tracking.shipment?.statusMilestone || 'pending',
      events: events.map((event: { eventId: string; status: string; occurrenceDatetime: string; location: string; statusDetails?: string; statusMilestone?: string; sourceCode?: string; courierCode: string }) => ({
        eventId: event.eventId,
        status: event.status,
        timestamp: event.occurrenceDatetime,
        location: event.location,
        description: event.statusDetails || event.status,
        courier: {
          name: CARRIER_CODES[event.courierCode as keyof typeof CARRIER_CODES]?.name || event.courierCode,
          code: event.courierCode
        },
        milestone: event.statusMilestone || 'pending',
        sourceCode: event.sourceCode
      })),
      estimatedDelivery,
      carrier: {
        name: CARRIER_CODES[courierCode as keyof typeof CARRIER_CODES]?.name || courierCode,
        code: courierCode
      },
      origin: {
        country: tracking.shipment?.originCountryCode,
        postcode: tracking.shipment?.recipient?.postCode,
        city: tracking.shipment?.recipient?.city
      },
      destination: {
        country: tracking.shipment?.destinationCountryCode,
        postcode: tracking.shipment?.recipient?.postCode,
        city: tracking.shipment?.recipient?.city
      },
      timestamps: tracking.statistics?.timestamps || {
        infoReceived: firstEvent?.occurrenceDatetime,
        inTransit: events.find((e: { statusMilestone: string }) => e.statusMilestone === 'in_transit')?.occurrenceDatetime,
        outForDelivery: events.find((e: { statusMilestone: string }) => e.statusMilestone === 'out_for_delivery')?.occurrenceDatetime,
        delivered: events.find((e: { statusMilestone: string }) => e.statusMilestone === 'delivered')?.occurrenceDatetime
      },
      transitTime: firstEvent ? {
        started: firstEvent.occurrenceDatetime,
        elapsed: Math.floor((Date.now() - new Date(firstEvent.occurrenceDatetime).getTime()) / (1000 * 60 * 60 * 24))
      } : null
    };

    console.log('Tracking information processed successfully');
    return NextResponse.json(formattedResponse);

  } catch (error) {
    console.error('Tracking process failed:', error);
    return NextResponse.json(
      { 
        error: 'Unable to process tracking request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
