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
            <span className="sr-only">Atras</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Preferencias</h1>
        <Button size="sm" className="ml-auto">
          <Save className="h-4 w-4 mr-2" />
          Guardar
        </Button>
      </header>

      <div className="flex-1 p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Tipos de Cocina</h2>
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
          <h2 className="text-lg font-semibold mb-3">Preferencias Dieteticas</h2>
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
          <h2 className="text-lg font-semibold mb-3">Rango de Precio</h2>
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
          <h2 className="text-lg font-semibold mb-3">Distancia</h2>
          <Select defaultValue="5">
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar distancia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 milla</SelectItem>
              <SelectItem value="5">5 millas</SelectItem>
              <SelectItem value="10">10 millas</SelectItem>
              <SelectItem value="25">25 millas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-semibold mb-3">Configuraciones Adicionales</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="open-now">Mostrar solo abiertos ahora</Label>
              <Switch id="open-now" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-places">Resaltar nuevos lugares</Label>
              <Switch id="new-places" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="popular">Priorizar lugares populares</Label>
              <Switch id="popular" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
