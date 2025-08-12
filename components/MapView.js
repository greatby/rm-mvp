'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Basic marker icon fix for Leaflet in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

export default function MapView({ properties }) {
  const center = properties?.length ? [properties[0].lat || 51.5074, properties[0].lng || -0.1278] : [51.5074, -0.1278]

  return (
    <div className="card overflow-hidden h-[480px]">
      <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties?.map(p => (
          (p.lat && p.lng) ? (
            <Marker key={p.id} position={[p.lat, p.lng]}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{p.title}</div>
                  <div>£{p.price.toLocaleString()}</div>
                  <div>{p.address}</div>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  )
}
