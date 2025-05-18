"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Importaciones de World ID para SIWE
// @ts-ignore
import { MiniKit, type MiniAppWalletAuthSuccessPayload } from "@worldcoin/minikit-js";
import { toast } from "@/components/ui/use-toast";
import { mockRestaurants } from "@/data/restaurants";
import { useRouter } from "next/navigation";

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload;
  nonce: string;
}

export default function NewReviewPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [availableRestaurants, setAvailableRestaurants] = useState(mockRestaurants);
  const [siwePayload, setSiwePayload] = useState<MiniAppWalletAuthSuccessPayload | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (MiniKit.user) {
      setUsername(MiniKit.user.username || null);
    }
  }, []); // Ejecutar solo al montar el componente (puede que necesites ajustar esto)

  useEffect(() => {
    setFormValid(selectedRestaurantId !== null && rating > 0 && comment.trim() !== "" && isAuthenticated && username?.trim() !== "");
  }, [selectedRestaurantId, rating, comment, isAuthenticated, username]);

  const handleSignInWithEthereum = async () => {
    if (!MiniKit.isInstalled()) {
      toast({ title: 'Error', description: 'Worldcoin MiniKit no está instalado.', variant: 'destructive' });
      return;
    }

    setIsAuthenticating(true);
    try {
      const nonceResponse = await fetch('/api/nonce');
      const { nonce } = await nonceResponse.json();

      const authResult = await MiniKit.commandsAsync.walletAuth({
        nonce,
        requestId: "0",
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
        statement: "Inicia sesión para dejar una reseña"
      });

      if (authResult.finalPayload && 'message' in authResult.finalPayload) {
        setSiwePayload(authResult.finalPayload);
        // Envía el payload y el nonce al backend para verificación
        const verificationResponse = await fetch('/api/complete-siwe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ payload: authResult.finalPayload, nonce }),
        });

        const verificationData = await verificationResponse.json();
        if (verificationData.isValid) {
          setIsAuthenticated(true);
          toast({ title: 'Autenticado', description: 'Autenticación con Ethereum exitosa.', variant: 'default' });
          // Intenta obtener el nombre de usuario inmediatamente después de la autenticación
          if (MiniKit?.user?.username) {
            setUsername(MiniKit.user.username);
          }
        } else {
          toast({ title: 'Error de Autenticación', description: verificationData.message || 'La autenticación con Ethereum falló.', variant: 'destructive' });
        }
      } else {
        toast({ title: 'Error de Autenticación', description: 'Ocurrió un error durante la autenticación.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error durante la autenticación con Ethereum:', error);
      toast({ title: 'Error', description: 'Ocurrió un error inesperado durante la autenticación.', variant: 'destructive' });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) {
      toast({ title: 'Error', description: 'Por favor, completa el formulario y autentícate.', variant: 'destructive' });
      return;
    }

    if (!selectedRestaurantId) {
      toast({ title: 'Error', description: 'Por favor, selecciona un restaurante.', variant: 'destructive' });
      return;
    }

    console.log("Restaurante ID:", selectedRestaurantId);
    console.log("Nombre de usuario:", username);
    console.log("Rating:", rating);
    console.log("Comentario:", comment);
    console.log("Autenticado:", isAuthenticated);
    console.log("SIWE Payload:", siwePayload);

    alert("¡Reseña enviada!");
    // Aquí enviarías los datos de la reseña al backend
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dejar una reseña</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="restaurant">Restaurante</Label>
          <Select value={selectedRestaurantId || ""} onValueChange={(value) => setSelectedRestaurantId(value)}>
            <SelectTrigger id="restaurant">
              <SelectValue placeholder="Seleccionar restaurante" />
            </SelectTrigger>
            <SelectContent>
              {availableRestaurants.map((restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Nombre de Usuario</Label>
          <Input
            type="text"
            value={username || ""}
            placeholder="Tu nombre de usuario"
            required
            disabled={isAuthenticated && !!username} // Deshabilita si el nombre de usuario está disponible
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <Label>Calificación</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={value <= rating ? "text-yellow-400" : "text-gray-400"}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Comentario</Label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe tu reseña..."
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Autenticación con Ethereum</Label>
          {isAuthenticated ? (
            <div className="flex items-center text-green-500">
              <Check className="w-4 h-4 mr-2" /> Autenticado como: {username || 'Usuario'}
            </div>
          ) : (
            <Button type="button" onClick={handleSignInWithEthereum} disabled={isAuthenticating}>
              {isAuthenticating ? "Autenticando..." : "Autenticar con Ethereum"}
            </Button>
          )}
          <p className="text-sm text-gray-500">Autentícate con tu billetera Ethereum para dejar una reseña.</p>
        </div>

        <Button type="submit" disabled={!formValid || isAuthenticating}>
          Enviar reseña
        </Button>
      </form>
    </div>
  );
}