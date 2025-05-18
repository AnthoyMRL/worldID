"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, Search, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import dynamic from "next/dynamic"
import { mockRestaurants, type Restaurant } from "@/data/restaurants"

// Dynamically import the Google Maps component with no SSR
const GoogleMapComponent = dynamic(() => import("@/components/map/google-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] bg-muted flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
})

// Custom hook for media query
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    const updateMatches = () => {
      setMatches(media.matches)
    }

    // Set initial value
    updateMatches()

    // Listen for changes
    media.addEventListener("change", updateMatches)

    return () => {
      media.removeEventListener("change", updateMatches)
    }
  }, [query])

  return matches
}

export default function HomePage() {
  const [restaurants] = useState<Restaurant[]>(mockRestaurants)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [mapVisible, setMapVisible] = useState(true)
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)

    // On mobile, scroll to the restaurant in the list
    if (isMobile) {
      const element = document.getElementById(`restaurant-${restaurant.id}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const handleRestaurantClick = (restaurant: Restaurant) => {
    router.push(`/restaurant/${restaurant.id}`)
  }

  const toggleMapView = () => {
    setMapVisible(!mapVisible)
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <header className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Faceback</h1>
          <Link href="/profile">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar restaurantes..." className="pl-8" />
          </div>
          <Link href="/preferences">
            <Button variant="outline" size="icon">
              <Sliders className="h-4 w-4" />
              <span className="sr-only">Preferencias</span>
            </Button>
          </Link>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          <Badge variant="secondary">Italiana</Badge>
          <Badge variant="secondary">Vegetariana</Badge>
          <Badge variant="secondary">Comida Rapida</Badge>
          <Badge variant="secondary">Asiatica</Badge>
          <Badge variant="secondary">Mexicana</Badge>
        </div>
      </header>

      <div className="relative flex-1 flex flex-col">
        {/* Map View Toggle Button */}
        <div className="absolute top-2 right-2 z-10">
          <Button variant="secondary" size="sm" onClick={toggleMapView}>
            {mapVisible ? "Ocultar Mapa" : "Mostrar Mapa"}
          </Button>
        </div>

        {/* Google Map */}
        <div className={`${mapVisible ? "h-[200px]" : "h-0 overflow-hidden"} transition-all duration-300 ease-in-out`}>
          {mapVisible && (
            <GoogleMapComponent restaurants={restaurants} onRestaurantSelect={handleRestaurantSelect} height="200px" />
          )}
        </div>

        <div className="p-4 flex-1">
          <h2 className="text-lg font-semibold mb-3">Recomendado para ti</h2>
          <ScrollArea className={`h-[calc(100dvh-${mapVisible ? "380px" : "180px"})]`}>
            <div className="space-y-3">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  id={`restaurant-${restaurant.id}`}
                  onClick={() => handleRestaurantClick(restaurant)}
                  className={`cursor-pointer transition-all duration-200 ${selectedRestaurant?.id === restaurant.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
                >
                  <Card className="overflow-hidden">
                    <div className="h-32 bg-muted relative">
                      <img
                        src={restaurant.image || "/placeholder.svg"}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2">{restaurant.rating} ★</Badge>
                      {restaurant.hasUserReviewed && (
                        <Badge variant="secondary" className="absolute top-2 left-2">
                          Reseñado
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{restaurant.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {restaurant.cuisine} • {restaurant.priceLevel}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{restaurant.distance}</span>
                          </div>
                        </div>
                        {restaurant.isPopular && (
                          <Badge variant="outline" className="ml-2">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <nav className="border-t bg-background p-2">
        <div className="flex justify-around">
          <Link href="/">
            <Button variant="ghost" className="flex flex-col h-auto py-2">
              <MapPin className="h-5 w-5" />
              <span className="text-xs mt-1">Explorar</span>
            </Button>
          </Link>
          <Link href="/reviews">
            <Button variant="ghost" className="flex flex-col h-auto py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span className="text-xs mt-1">Reseñas</span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="flex flex-col h-auto py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-xs mt-1">Perfil</span>
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  )
}
