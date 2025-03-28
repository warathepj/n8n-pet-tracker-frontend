import { MapContainer, TileLayer, useMapEvents, Marker, GeoJSON } from 'react-leaflet'
import { useMap } from 'react-leaflet/hooks'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import geofenceData from '../geofence.json'

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
})

function DraggableMarker({ position, setPosition }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(position, map.getZoom())
  }, [position])

  return (
    <Marker
      draggable
      icon={icon}
      position={position}
      eventHandlers={{
        dragend: (e) => {
          const newPos = e.target.getLatLng()
          setPosition(newPos)
        },
      }}
    />
  )
}

export function PetMap({ position, setPosition }) {
  const [map, setMap] = useState(null)
  const initialPosition = { lat: 14.524905435350691, lng: 101.38315173213998 }

  const geofenceStyle = {
    fillColor: '#ff7800',
    fillOpacity: 0.1,
    color: '#ff7800',
    weight: 2
  }

  return (
    <div className="h-[600px] w-full rounded-lg">
      <MapContainer
        center={initialPosition}
        zoom={13}
        ref={setMap}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON data={geofenceData} style={geofenceStyle} />
        {map && <DraggableMarker position={position} setPosition={setPosition} />}
      </MapContainer>
    </div>
  )
}
