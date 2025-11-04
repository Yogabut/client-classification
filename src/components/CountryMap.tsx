import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface CountryData {
  country: string;
  count: number;
  coordinates: [number, number];
}

const countryData: CountryData[] = [
  { country: 'USA', count: 180, coordinates: [37.0902, -95.7129] },
  { country: 'UK', count: 95, coordinates: [55.3781, -3.4360] },
  { country: 'Germany', count: 78, coordinates: [51.1657, 10.4515] },
  { country: 'France', count: 62, coordinates: [46.2276, 2.2137] },
  { country: 'Canada', count: 45, coordinates: [56.1304, -106.3468] },
  { country: 'Australia', count: 51, coordinates: [-25.2744, 133.7751] },
];

export const CountryMap = () => {
  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
      <MapContainer
        center={[30, 10]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {countryData.map((data) => (
          <CircleMarker
            key={data.country}
            center={data.coordinates}
            radius={Math.max(8, data.count / 10)}
            pathOptions={{
              fillColor: 'hsl(var(--primary))',
              fillOpacity: 0.8,
              color: 'hsl(var(--background))',
              weight: 3,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-primary mb-1">{data.country}</h3>
                <p className="text-sm text-muted-foreground">{data.count} clients</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};
