import Link from "next/link"
import { ChevronLeft, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReviewsPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="px-4 py-3 border-b flex items-center">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Reviews</h1>
        <Link href="/reviews/new" className="ml-auto">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Review
          </Button>
        </Link>
      </header>

      <div className="flex-1 p-4">
        {/* This would normally check for a query parameter or state to show this message */}
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 flex items-center">
          <Check className="h-5 w-5 mr-2" />
          <span>Your review has been submitted successfully!</span>
        </div>
        <Tabs defaultValue="my-reviews">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="my-reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="my-reviews" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Restaurant" />
                      <AvatarFallback>R1</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Italian Bistro</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="flex items-center">★★★★☆ 4.0</span>
                        <span className="mx-2">•</span>
                        <span>2 days ago</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    Verified
                  </Badge>
                </div>
                <p className="text-sm">
                  The pasta was absolutely delicious and the service was excellent. I would highly recommend the
                  carbonara and tiramisu for dessert.
                </p>
              </CardContent>
              <CardFooter className="px-4 py-2 border-t flex justify-between">
                <div className="text-sm text-muted-foreground">
                  <span>12 likes</span>
                </div>
                <Badge variant="secondary">+1 Token</Badge>
              </CardFooter>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Restaurant" />
                      <AvatarFallback>R2</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Taco Heaven</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="flex items-center">★★★☆☆ 3.0</span>
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
                  The tacos were good but a bit overpriced for the portion size. The salsa was fresh and delicious
                  though.
                </p>
              </CardContent>
              <CardFooter className="px-4 py-2 border-t flex justify-between">
                <div className="text-sm text-muted-foreground">
                  <span>5 likes</span>
                </div>
                <Badge variant="secondary">+1 Token</Badge>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-4">
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
                        <span>Sushi Palace</span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">★★★★★ 5.0</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    Verified
                  </Badge>
                </div>
                <p className="text-sm">
                  Best sushi I've had in years! The fish was incredibly fresh and the chef's special roll was a perfect
                  combination of flavors.
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
                        <span>Burger Joint</span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">★★★★☆ 4.0</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    Verified
                  </Badge>
                </div>
                <p className="text-sm">
                  Great burgers with lots of topping options. The fries were crispy and well-seasoned. Will definitely
                  be back!
                </p>
              </CardContent>
              <CardFooter className="px-4 py-2 border-t">
                <div className="text-sm text-muted-foreground">
                  <span>15 likes</span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
