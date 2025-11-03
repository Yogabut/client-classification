import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface CountryData {
  country: string;
  count: number;
  coordinates: [number, number];
}

const countryData: CountryData[] = [
  { country: 'USA', count: 180, coordinates: [-95.7129, 37.0902] },
  { country: 'UK', count: 95, coordinates: [-3.4360, 55.3781] },
  { country: 'Germany', count: 78, coordinates: [10.4515, 51.1657] },
  { country: 'France', count: 62, coordinates: [2.2137, 46.2276] },
  { country: 'Canada', count: 45, coordinates: [-106.3468, 56.1304] },
  { country: 'Australia', count: 51, coordinates: [133.7751, -25.2744] },
];

export const CountryMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState(localStorage.getItem('mapbox_token') || '');
  const [isTokenSet, setIsTokenSet] = useState(!!localStorage.getItem('mapbox_token'));

  const handleSetToken = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setIsTokenSet(true);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !isTokenSet || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 1.2,
        center: [10, 30],
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        // Add markers for each country
        countryData.forEach((data) => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.width = `${Math.max(20, data.count / 5)}px`;
          el.style.height = `${Math.max(20, data.count / 5)}px`;
          el.style.borderRadius = '50%';
          el.style.backgroundColor = 'hsl(var(--primary))';
          el.style.border = '3px solid hsl(var(--background))';
          el.style.cursor = 'pointer';
          el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 8px; font-family: system-ui;">
              <h3 style="margin: 0 0 4px 0; font-weight: 600; color: hsl(var(--primary));">${data.country}</h3>
              <p style="margin: 0; color: hsl(var(--muted-foreground));">${data.count} clients</p>
            </div>`
          );

          new mapboxgl.Marker(el)
            .setLngLat(data.coordinates)
            .setPopup(popup)
            .addTo(map.current!);
        });
      });

      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [isTokenSet, mapboxToken]);

  if (!isTokenSet) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] p-6 bg-muted/20 rounded-lg border-2 border-dashed">
        <div className="w-full max-w-md space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Mapbox Token Required</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your Mapbox public token to display the client distribution map.
              Get your token at{' '}
              <a
                href="https://account.mapbox.com/access-tokens/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
          </div>
          <Button onClick={handleSetToken} className="w-full">
            Set Token & Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};
