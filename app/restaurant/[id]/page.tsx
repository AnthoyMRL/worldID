"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, MapPin, Share, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)

  useEffect(() => {
    // In a real app, you would fetch this from an API
    const found = mockRestaurants.find((r) => r.id === params.id)
    if (found) {
      setRestaurant(found)
    }
  }, [params.id])

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading restaurant details...</p>
      </div>
    )
  }

  // This would normally come from a database check
  const hasUserReviewed = restaurant.hasUserReviewed || false

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <div className="relative h-64 bg-muted">
        <img
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
            <Share className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>

      <div className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                {restaurant.rating} (120+ reviews)
              </span>
              <span className="mx-2">•</span>
              <span>{restaurant.cuisine}</span>
              <span className="mx-2">•</span>
              <span>{restaurant.priceLevel}</span>
            </div>
          </div>
          <Badge>Open Now</Badge>
        </div>

        <div className="flex items-center mt-3 text-sm">
          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
          <span>123 Main St, Anytown, USA</span>
        </div>

        <div className="flex gap-2 mt-4">
          <Button className="flex-1">Reserve</Button>
          <Link href={`/reviews/new?restaurant=${params.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Write Review
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="about" className="flex-1 mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-sm text-muted-foreground">
              A cozy restaurant offering authentic {restaurant.cuisine} cuisine made with fresh, locally-sourced
              ingredients. Our chef brings traditional recipes with a modern twist.
            </p>
          </div>

          <Separator />

          {/* Map showing restaurant location */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Location</h2>
            <div className="h-[200px] rounded-md overflow-hidden">
              <GoogleMapComponent restaurants={[restaurant]} height="200px" />
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-2">Hours</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Monday - Thursday</div>
              <div>11:00 AM - 10:00 PM</div>
              <div>Friday - Saturday</div>
              <div>11:00 AM - 11:00 PM</div>
              <div>Sunday</div>
              <div>12:00 PM - 9:00 PM</div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-2">Contact</h2>
            <div className="space-y-1 text-sm">
              <p>(555) 123-4567</p>
              <p>info@{restaurant.name.toLowerCase().replace(/\s+/g, "")}.com</p>
              <p>www.{restaurant.name.toLowerCase().replace(/\s+/g, "")}.com</p>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-2">Features</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Outdoor Seating</Badge>
              <Badge variant="outline">Takeout</Badge>
              <Badge variant="outline">Delivery</Badge>
              <Badge variant="outline">Reservations</Badge>
              <Badge variant="outline">Wheelchair Accessible</Badge>
              <Badge variant="outline">Full Bar</Badge>
            </div>
          </div>
        </TabsContent>

        {/* Rest of the tabs content remains the same */}
        <TabsContent value="menu" className="p-4 space-y-4">
          {/* Menu content remains the same */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Appetizers</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">Bruschetta</h3>
                  <p className="text-sm text-muted-foreground">Toasted bread topped with tomatoes, garlic, and basil</p>
                </div>
                <div className="font-medium">$8</div>
              </div>
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">Calamari Fritti</h3>
                  <p className="text-sm text-muted-foreground">Crispy fried calamari with marinara sauce</p>
                </div>
                <div className="font-medium">$12</div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-3">Pasta</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">Spaghetti Carbonara</h3>
                  <p className="text-sm text-muted-foreground">Spaghetti with pancetta, egg, and parmesan</p>
                </div>
                <div className="font-medium">$16</div>
              </div>
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">Fettuccine Alfredo</h3>
                  <p className="text-sm text-muted-foreground">Fettuccine in a creamy parmesan sauce</p>
                </div>
                <div className="font-medium">$15</div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-3">Main Courses</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">Chicken Parmesan</h3>
                  <p className="text-sm text-muted-foreground">Breaded chicken with tomato sauce and mozzarella</p>
                </div>
                <div className="font-medium">$18</div>
              </div>
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">Grilled Salmon</h3>
                  <p className="text-sm text-muted-foreground">With lemon butter sauce and seasonal vegetables</p>
                </div>
                <div className="font-medium">$22</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{restaurant.rating}</div>
              <div className="flex text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current opacity-40" />
              </div>
              <div className="text-sm text-muted-foreground mt-1">Based on 120+ reviews</div>
            </div>
            {/* Check if user has already reviewed this restaurant */}
            {hasUserReviewed ? (
              <Button variant="outline" disabled>
                Already Reviewed
              </Button>
            ) : (
              <Link href={`/reviews/new?restaurant=${params.id}`}>
                <Button>Write Review</Button>
              </Link>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Jane Doe</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="flex items-center">★★★★★ 5.0</span>
                        <span className="mx-2">•</span>
                        <span>3 days ago</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    Verified
                  </Badge>
                </div>
                <p className="text-sm">
                  Absolutely amazing experience! The food was delicious and the service was impeccable. I highly
                  recommend the pasta carbonara and tiramisu.
                </p>
              </CardContent>
              <CardFooter className="px-4 py-2 border-t">
                <div className="text-sm text-muted-foreground">
                  <span>28 likes</span>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Mike Smith</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="flex items-center">★★★★☆ 4.0</span>
                        <span className="mx-2">•</span>
                        <span>1 week ago</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    Verified
                  </Badge>
                </div>
                <p className="text-sm">
                  Great food and atmosphere. The service was a bit slow during peak hours, but the quality of the food
                  made up for it. Will definitely return.
                </p>
              </CardContent>
              <CardFooter className="px-4 py-2 border-t">
                <div className="text-sm text-muted-foreground">
                  <span>15 likes</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
