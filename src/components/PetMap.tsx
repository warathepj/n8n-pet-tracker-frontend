import { MapContainer, TileLayer, useMapEvents, Marker, GeoJSON } from 'react-leaflet'
import { useMap } from 'react-leaflet/hooks'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import geofenceData from '../geofence.json'
import * as turf from '@turf/turf'
import { useToast } from '../hooks/use-toast'
import { AlertToast, AlertToastProvider, AlertToastViewport, AlertToastClose } from '@/components/ui/alert-toast'
import ReactDOM from 'react-dom'

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
})

function DraggableMarker({ position, setPosition }) {
  const map = useMap()
  const { toast } = useToast()

  const showAlertToast = async (newPos) => {
    const alertRoot = document.createElement('div')
    document.body.appendChild(alertRoot)
    
    // Send alert to backend
    try {
      await fetch('http://localhost:3000/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: 'Pet outside safe zone',
          location: {
            lat: newPos.lat,
            lng: newPos.lng
          }
        }),
      });
    } catch (error) {
      console.error('Error sending alert to backend:', error);
    }
    
    const alert = (
      <AlertToastProvider swipeDirection="left">
        <AlertToast className="text-red-600 font-semibold border-red-600 bg-white">
          <div>
            <h2 className="text-lg font-semibold">Pets outside the area</h2>
            <p>Your pet has left the designated safe zone!</p>
          </div>
          <AlertToastClose />
        </AlertToast>
        <AlertToastViewport />
      </AlertToastProvider>
    )
    
    ReactDOM.render(alert, alertRoot)
    
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(alertRoot)
      document.body.removeChild(alertRoot)
    }, 5000)
  }

  const isPointInGeofence = (point) => {
    const turfPoint = turf.point([point.lng, point.lat])
    const geofencePolygon = turf.polygon(geofenceData.features[0].geometry.coordinates)
    return turf.booleanPointInPolygon(turfPoint, geofencePolygon)
  }

  return (
    <Marker
      draggable
      icon={icon}
      position={position}
      eventHandlers={{
        dragend: (e) => {
          const newPos = e.target.getLatLng()
          setPosition(newPos)
          
          if (!isPointInGeofence(newPos)) {
            showAlertToast(newPos)
          } else {
            toast({
              title: "Location Updated",
              description: "Pet's location has been updated",
            })
          }
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
