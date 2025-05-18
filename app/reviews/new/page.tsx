"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Star, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { reviewService } from "@/services/review-service";
import { rewardsService } from "@/services/rewards-service";
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';

export default function NewReviewPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [verified, setVerified] = useState(false);
  const [restaurant, setRestaurant] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [fieldsFilled, setFieldsFilled] = useState(false);

  const verifyPayload: VerifyCommandInput = {
    action: 'resena', // This is your action ID from the Developer Portal
    verification_level: VerificationLevel.Device, // Orb | Device
  };

  useEffect(() => {
    console.log("useEffect - verified:", verified, "canSubmit:", canSubmit);
    if (verified) {
      setCanSubmit(true);
    }
  }, [verified]);

  useEffect(() => {
    // Check if all required fields are filled
    if (restaurant && rating > 0 && reviewText) {
      setFieldsFilled(true);
    } else {
      setFieldsFilled(false);
    }
  }, [restaurant, rating, reviewText]);

  const handleVerify = async () => {
    if (!MiniKit.isInstalled()) {
      console.error("Worldcoin MiniKit no está instalado.");
      return;
    }

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

      if (finalPayload.status === 'error') {
        console.log('Error payload', finalPayload);
        return;
      }

      // Verify the proof in the backend
      const verifyResponse = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload as ISuccessResult,
          action: 'resena', // Ensure this matches your backend's expectation
          signal: 'review-' + Date.now(),
        }),
      });

      if (!verifyResponse.ok) {
        console.error(`Verificacion del backend fallida con el estado: ${verifyResponse.status}`);
        return;
      }

      const verifyResponseJson = await verifyResponse.json();
      console.log("Respuesta de verificacion del backend:", verifyResponseJson);

      if (verifyResponseJson.success) {
        console.log('Verificacion del backend exitosa');
        setVerified(true);
        setCanSubmit(true);
        // Optionally call handleSubmit here if you want to auto-submit after verification
        // handleSubmit();
      } else {
        console.error('Verificacion del backend fallida:', verifyResponseJson.verifyRes?.error?.message || 'Error desconocido');
      }
    } catch (error) {
      console.error("Error durante la verificacion de World ID:", error);
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit - canSubmit:", canSubmit, "isSubmitting:", isSubmitting, "fieldsFilled:", fieldsFilled);
    if (isSubmitting || !canSubmit || !fieldsFilled) {
      console.log("Envio de reseña detenido.");
      return;
    }
    setIsSubmitting(true);

    const result = await reviewService.submitReview(restaurant, rating, reviewText, verified);
    setIsSubmitting(false);

    if (result.success) {
      console.log("Reseña enviada exitosamente!");
      await rewardsService.giveReviewReward();
      router.push("/reviews?submitted=true");
    } else {
      console.error("Error al enviar la reseña:", result.message);
    }
  };

  const handleReviewButtonClick = () => {
    if (!fieldsFilled) {
      alert("Por favor, llena todos los campos requeridos antes de enviar la reseña.");
      return;
    }
    if (!verified) {
      handleVerify();
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="px-4 py-3 border-b flex items-center">
        <Link href="/reviews">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Atras</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Nueva Reseña</h1>
      </header>

      <div className="flex-1 p-4">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="restaurant">Restaurante</Label>
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
            <Label>Calificación</Label>
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
                  <span className="sr-only">{star} estrellas</span>
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
                {!verified ? (
                  <Button variant="outline" className="w-full" onClick={handleVerify} disabled={!fieldsFilled}>
                    Verificar con World ID
                  </Button>
                ) : (
                  <div className="flex items-center text-green-600">
                    <Check className="h-5 w-5 mr-2" />
                    <span>Verificado con World ID</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Button className="w-full" type="button" onClick={handleReviewButtonClick} disabled={isSubmitting || !fieldsFilled || !canSubmit}>
            {isSubmitting ? "Enviando..." : "Enviar Reseña"}
          </Button>
        </form>
      </div>
    </div>
  );
}