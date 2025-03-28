import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
import { useMap } from 'react-leaflet/hooks'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'

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

  return (
    <div className="h-[600px] w-full rounded-lg">
      <MapContainer
        center={position}
        zoom={13}
        ref={setMap}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {map && <DraggableMarker position={position} setPosition={setPosition} />}
      </MapContainer>
    </div>
  )
}
