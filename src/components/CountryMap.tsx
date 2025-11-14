import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/integrations/supabase/client';

interface ClientData {
  id: string;
  country: string;
  coordinates: [number, number];
}

export const CountryMap = () => {
  const [clientData, setClientData] = useState<ClientData[]>([]);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    const fetchClientLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, country, latitude, longitude');

        if (error) throw error;

        const clients: ClientData[] = data.map((client) => ({
          id: client.id,
          country: client.country,
          coordinates: [Number(client.latitude), Number(client.longitude)],
        }));

        setClientData(clients);
      } catch (error) {
        console.error('Error fetching client locations:', error);
      }
    };

    fetchClientLocations();
  }, []);

  useEffect(() => {
    if (!mapRef.current || clientData.length === 0) return;
    if (leafletMap.current) {
      leafletMap.current.remove();
    }

    // Group untuk count per negara
    const countryCount = clientData.reduce((acc, client) => {
      acc[client.country] = (acc[client.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Find country with most clients
    const topCountry = Object.entries(countryCount).reduce((prev, current) => 
      (prev[1] > current[1]) ? prev : current
    )[0];

    // Get first client from top country for center
    const centerClient = clientData.find(c => c.country === topCountry);

    // Initialize Leaflet map
    leafletMap.current = L.map(mapRef.current, {
      center: centerClient?.coordinates || [0, 0],
      zoom: 3,
      zoomControl: true,
      scrollWheelZoom: false,
      worldCopyJump: true,
    });

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap.current);

    // Add circle markers for each client
    clientData.forEach((client) => {
      const countryTotal = countryCount[client.country];
      
      const circle = L.circleMarker(client.coordinates, {
        radius: 9,
        color: 'hsl(var(--background))',
        weight: 3,
        fillColor: 'hsl(var(--primary))',
        fillOpacity: 0.8,
      }).addTo(leafletMap.current!);

      const popupHtml = `
        <div style="padding: 6px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
          <div style="margin:0 0 4px 0; font-weight:600; color: hsl(var(--primary));">${client.country}</div>
          <div style="margin:0; color: hsl(var(--muted-foreground)); font-size: 12px;">${countryTotal} client${countryTotal > 1 ? 's' : ''}</div>
        </div>
      `;
      circle.bindPopup(popupHtml);
    });

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, [clientData]);

  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
};