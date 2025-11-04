import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/integrations/supabase/client';

interface CountryData {
  country: string;
  count: number;
  coordinates: [number, number]; // [lat, lng]
}

export const CountryMap = () => {
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    const fetchClientLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('country, latitude, longitude');

        if (error) throw error;

        // Group by country and aggregate
        const grouped = data.reduce((acc, client) => {
          if (!acc[client.country]) {
            acc[client.country] = { count: 0, lat: Number(client.latitude), lng: Number(client.longitude) };
          }
          acc[client.country].count++;
          return acc;
        }, {} as Record<string, { count: number; lat: number; lng: number }>);

        const aggregated: CountryData[] = Object.entries(grouped).map(([country, data]) => ({
          country,
          count: data.count,
          coordinates: [data.lat, data.lng],
        }));

        setCountryData(aggregated);
      } catch (error) {
        console.error('Error fetching client locations:', error);
      }
    };

    fetchClientLocations();
  }, []);

  useEffect(() => {
    if (!mapRef.current || countryData.length === 0) return;
    if (leafletMap.current) {
      leafletMap.current.remove();
    }

    // Initialize Leaflet map
    leafletMap.current = L.map(mapRef.current, {
      center: [30, 10],
      zoom: 2,
      zoomControl: true,
      scrollWheelZoom: false,
      worldCopyJump: true,
    });

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap.current);

    // Add circle markers with popups
    countryData.forEach((data) => {
      const radius = Math.max(8, data.count / 10);
      const circle = L.circleMarker(data.coordinates, {
        radius,
        color: 'hsl(var(--background))',
        weight: 3,
        fillColor: 'hsl(var(--primary))',
        fillOpacity: 0.8,
      }).addTo(leafletMap.current!);

      const popupHtml = `
        <div style="padding: 6px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
          <div style="margin:0 0 4px 0; font-weight:600; color: hsl(var(--primary));">${data.country}</div>
          <div style="margin:0; color: hsl(var(--muted-foreground)); font-size: 12px;">${data.count} clients</div>
        </div>
      `;
      circle.bindPopup(popupHtml);
    });

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, [countryData]);

  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
};
