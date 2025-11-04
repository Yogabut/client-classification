import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CountryData {
  country: string;
  count: number;
  coordinates: [number, number]; // [lat, lng]
}

const countryData: CountryData[] = [
  { country: 'USA', count: 180, coordinates: [37.0902, -95.7129] },
  { country: 'UK', count: 95, coordinates: [55.3781, -3.436] },
  { country: 'Germany', count: 78, coordinates: [51.1657, 10.4515] },
  { country: 'France', count: 62, coordinates: [46.2276, 2.2137] },
  { country: 'Canada', count: 45, coordinates: [56.1304, -106.3468] },
  { country: 'Australia', count: 51, coordinates: [-25.2744, 133.7751] },
];

export const CountryMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

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
  }, []);

  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
};
