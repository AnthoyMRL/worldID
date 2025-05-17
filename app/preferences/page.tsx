"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PreferencesPage() {
  const [cuisines, setCuisines] = useState({
    italian: true,
    mexican: false,
    chinese: true,
    japanese: false,
    indian: true,
    american: false,
    thai: false,
    mediterranean: true,
    french: false,
    korean: false,
  })

  const [dietaryPreferences, setDietaryPreferences] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    nutFree: false,
    halal: false,
    kosher: false,
  })

  const [priceRange, setPriceRange] = useState([50])

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="px-4 py-3 border-b flex items-center">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Preferences</h1>
        <Button size="sm" className="ml-auto">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </header>

      <div className="flex-1 p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Cuisine Types</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(cuisines).map(([cuisine, checked]) => (
              <div key={cuisine} className="flex items-center space-x-2">
                <Checkbox
                  id={`cuisine-${cuisine}`}
                  checked={checked}
                  onCheckedChange={(value) => setCuisines((prev) => ({ ...prev, [cuisine]: !!value }))}
                />
                <Label htmlFor={`cuisine-${cuisine}`} className="capitalize">
                  {cuisine}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-semibold mb-3">Dietary Preferences</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(dietaryPreferences).map(([pref, checked]) => (
              <div key={pref} className="flex items-center space-x-2">
                <Checkbox
                  id={`pref-${pref}`}
                  checked={checked}
                  onCheckedChange={(value) => setDietaryPreferences((prev) => ({ ...prev, [pref]: !!value }))}
                />
                <Label htmlFor={`pref-${pref}`} className="capitalize">
                  {pref.replace(/([A-Z])/g, " $1").trim()}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-semibold mb-3">Price Range</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>$</span>
              <span>$$</span>
              <span>$$$</span>
              <span>$$$$</span>
            </div>
            <Slider value={priceRange} max={100} step={1} onValueChange={setPriceRange} />
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-semibold mb-3">Distance</h2>
          <Select defaultValue="5">
            <SelectTrigger>
              <SelectValue placeholder="Select distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 mile</SelectItem>
              <SelectItem value="5">5 miles</SelectItem>
              <SelectItem value="10">10 miles</SelectItem>
              <SelectItem value="25">25 miles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-semibold mb-3">Additional Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="open-now">Show only open now</Label>
              <Switch id="open-now" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-places">Highlight new places</Label>
              <Switch id="new-places" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="popular">Prioritize popular spots</Label>
              <Switch id="popular" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
