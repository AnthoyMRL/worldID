"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define the restaurant type
interface Restaurant {
  id: string
  name: string
  rating: number
  lat: number
  lng: number
  image: string
  cuisine: string
  priceLevel: string
}

interface MapProps {
  restaurants: Restaurant[]
  onRestaurantSelect?: (restaurant: Restaurant) => void
  height?: string
}

const containerStyle = {
  width: "100%",
  height: "100%",
}

// Default center (can be updated with user's location)
const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194, // San Francisco
}

export default function GoogleMapComponent({ restaurants, onRestaurantSelect, height = "100%" }: MapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [center, setCenter] = useState(defaultCenter)
  const mapRef = useRef<google.maps.Map | null>(null)

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(userPos)
          setCenter(userPos)
        },
        () => {
          console.log("Error getting location")
        },
      )
    }
  }, [])

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    mapRef.current = null
    setMap(null)
  }, [])

  const handleMarkerClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    if (onRestaurantSelect) {
      onRestaurantSelect(restaurant)
    }
  }

  const handleInfoWindowClose = () => {
    setSelectedRestaurant(null)
  }

  // Center map on user location
  const centerOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo(userLocation)
      mapRef.current.setZoom(15)
    }
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <div className="text-center p-4">
          <p className="text-red-500">Error loading maps</p>
          <p className="text-sm text-muted-foreground mt-2">Please check your API key and internet connection</p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div style={{ height, position: "relative" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: false,
        }}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />
        )}

        {/* Restaurant markers */}
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={{ lat: restaurant.lat, lng: restaurant.lng }}
            onClick={() => handleMarkerClick(restaurant)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        ))}

        {/* Info window for selected restaurant */}
        {selectedRestaurant && (
          <InfoWindow
            position={{ lat: selectedRestaurant.lat, lng: selectedRestaurant.lng }}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="p-1 max-w-[200px]">
              <h3 className="font-medium text-sm">{selectedRestaurant.name}</h3>
              <div className="text-xs mt-1">
                <span className="flex items-center">
                  {"★".repeat(Math.floor(selectedRestaurant.rating))}
                  {"☆".repeat(5 - Math.floor(selectedRestaurant.rating))}
                  <span className="ml-1">{selectedRestaurant.rating}</span>
                </span>
                <p className="mt-1">
                  {selectedRestaurant.cuisine} • {selectedRestaurant.priceLevel}
                </p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* My location button */}
      {userLocation && (
        <Button
          size="sm"
          variant="secondary"
          className="absolute bottom-4 right-4 shadow-md"
          onClick={centerOnUserLocation}
        >
          My Location
        </Button>
      )}
    </div>
  )
}
