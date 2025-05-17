export interface Restaurant {
  id: string
  name: string
  rating: number
  lat: number
  lng: number
  image: string
  cuisine: string
  priceLevel: string
  distance: string
  isPopular: boolean
  hasUserReviewed?: boolean
}

// Generate random coordinates around a center point
function getRandomCoordinate(center: { lat: number; lng: number }, radiusKm: number) {
  // Earth's radius in kilometers
  const earthRadius = 6371

  // Convert radius from kilometers to radians
  const radiusInRadian = radiusKm / earthRadius

  // Random angle
  const randomAngle = Math.random() * Math.PI * 2

  // Random distance within radius
  const randomDistance = Math.random() * radiusInRadian

  // Calculate offset
  const lat = center.lat + randomDistance * Math.cos(randomAngle)
  const lng = center.lng + randomDistance * Math.sin(randomAngle)

  return { lat, lng }
}

// San Francisco center coordinates
const sfCenter = { lat: 37.7749, lng: -122.4194 }

// Generate mock restaurant data with coordinates around San Francisco
export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Italian Bistro",
    rating: 4.5,
    ...getRandomCoordinate(sfCenter, 2),
    image: "/placeholder.svg?height=128&width=384&text=Restaurant%201",
    cuisine: "Italian",
    priceLevel: "$$",
    distance: "1.2 miles",
    isPopular: true,
    hasUserReviewed: true,
  },
  {
    id: "2",
    name: "Taco Heaven",
    rating: 4.2,
    ...getRandomCoordinate(sfCenter, 2),
    image: "/placeholder.svg?height=128&width=384&text=Restaurant%202",
    cuisine: "Mexican",
    priceLevel: "$$",
    distance: "0.8 miles",
    isPopular: true,
  },
  {
    id: "3",
    name: "Sushi Palace",
    rating: 4.7,
    ...getRandomCoordinate(sfCenter, 2),
    image: "/placeholder.svg?height=128&width=384&text=Restaurant%203",
    cuisine: "Japanese",
    priceLevel: "$$$",
    distance: "1.5 miles",
    isPopular: true,
  },
  {
    id: "4",
    name: "Burger Joint",
    rating: 4.0,
    ...getRandomCoordinate(sfCenter, 2),
    image: "/placeholder.svg?height=128&width=384&text=Restaurant%204",
    cuisine: "American",
    priceLevel: "$",
    distance: "2.1 miles",
    isPopular: false,
  },
  {
    id: "5",
    name: "Pizza Place",
    rating: 4.3,
    ...getRandomCoordinate(sfCenter, 2),
    image: "/placeholder.svg?height=128&width=384&text=Restaurant%205",
    cuisine: "Italian",
    priceLevel: "$$",
    distance: "1.7 miles",
    isPopular: false,
  },
]
