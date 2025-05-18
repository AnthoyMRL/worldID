"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Star, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";


export default function NewReviewPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [verified, setVerified] = useState(false);
  const [restaurant, setRestaurant] = useState("");
  const [reviewText, setReviewText] = useState("");

  const handleVerify = () => {
    // Aquí iría tu lógica real para verificar con World ID
    console.log("Iniciando verificación con World ID...");
    setVerified(true); // Simulación de verificación exitosa
    // En un escenario real, actualizarías el estado 'verified'
    // basado en el resultado de la verificación con World ID.
  };

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!verified) {
      handleVerify();
      setVerified(true);
      return;
    }
    // Aquí iría la lógica para enviar la nueva reseña
    console.log("Enviando reseña:", { restaurant, rating, reviewText, verified });
    router.push("/reviews"); // Redirigir a la página de reseñas después de enviar
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="px-4 py-3 border-b flex items-center">
        <Link href="/reviews">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">New Review</h1>
      </header>

      <div className="flex-1 p-4">
        <form className="space-y-6" onSubmit={handleSubmitReview}>
          <div className="space-y-2">
            <Label htmlFor="restaurant">Restaurant</Label>
            <Select value={restaurant} onValueChange={(value) => setRestaurant(value)}>
              <SelectTrigger id="restaurant">
                <SelectValue placeholder="Selecciona restaurante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="italian-bistro">Italian Bistro</SelectItem>
                <SelectItem value="taco-heaven">Taco Heaven</SelectItem>
                <SelectItem value="sushi-palace">Sushi Palace</SelectItem>
                <SelectItem value="burger-joint">Burger Joint</SelectItem>
                <SelectItem value="pizza-place">Pizza Place</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-6 w-6 ${
                      rating >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                  <span className="sr-only">{star} stars</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">Tu Reseña</Label>
            <Textarea
              id="review"
              placeholder="Comparte tu experiencia..."
              className="min-h-[120px]"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Fotos (opcional)</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Verifica tu reseña</CardTitle>
                <CardDescription>Prueba que realmente visitaste para ganar tokens</CardDescription>
              </CardHeader>
              <CardContent>
                {!verified && (
                  <div className="flex items-center text-muted-foreground">
                    <svg
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z"
                        fill="currentColor"
                      />
                      <path
                        d="M16 6C10.477 6 6 10.477 6 16C6 21.523 10.477 26 16 26C21.523 26 26 21.523 26 16C26 10.477 21.523 6 16 6ZM16 22C12.686 22 10 19.314 10 16C10 12.686 12.686 10 16 10C19.314 10 22 12.686 22 16C22 19.314 19.314 22 16 22Z"
                        fill="white"
                      />
                    </svg>
                    <span>Verificacion requerida para ganar tokens</span>
                  </div>
                )}
                {verified && (
                  <div className="flex items-center text-green-600">
                    <Check className="h-5 w-5 mr-2" />
                    <span>Verificado con World ID</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Button className="w-full" type="submit" onClick={handleSubmitReview}>
            Enviar Reseña
          </Button>
        </form>
      </div>
    </div>
  );
}