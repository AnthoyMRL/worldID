import Link from "next/link"
import { ChevronLeft, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function RewardsPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="px-4 py-3 border-b flex items-center">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Rewards</h1>
      </header>

      <div className="flex-1 p-4 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-yellow-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" fill="currentColor" />
                <path d="M12 6V18M18 12H6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Your Token Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">8</div>
              <div className="text-sm text-muted-foreground">2 more for next reward</div>
            </div>
            <Progress value={80} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-semibold mb-3">Available Rewards</h2>
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">10% Off Your Next Meal</h3>
                    <p className="text-sm text-muted-foreground">Valid at any participating restaurant</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
                <Badge variant="secondary">10 Tokens</Badge>
                <Button size="sm" disabled>
                  Redeem
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Free Appetizer</h3>
                    <p className="text-sm text-muted-foreground">With purchase of an entree</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
                <Badge variant="secondary">15 Tokens</Badge>
                <Button size="sm" disabled>
                  Redeem
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Priority Reservations</h3>
                    <p className="text-sm text-muted-foreground">Skip the wait at popular restaurants</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
                <Badge variant="secondary">20 Tokens</Badge>
                <Button size="sm" disabled>
                  Redeem
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Free Dessert</h3>
                    <p className="text-sm text-muted-foreground">At any participating restaurant</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
                <Badge variant="secondary">25 Tokens</Badge>
                <Button size="sm" disabled>
                  Redeem
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
