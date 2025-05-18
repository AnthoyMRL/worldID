"use client";

import Link from "next/link";
import { ChevronLeft, Gift, LogOut, Settings, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MiniKit } from '@worldcoin/minikit-js';
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [isVerifiedWallet, setIsVerifiedWallet] = useState(false); // You might want to track this

  useEffect(() => {
    if (MiniKit.user) {
      setUsername(MiniKit.user.username || null);
      setIsVerifiedWallet(true); // Assuming if username exists, wallet is verified
    }
  }, []);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="px-4 py-3 border-b flex items-center">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Perfil</h1>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Configuraciones</span>
        </Button>
      </header>

      <div className="flex-1 p-4 space-y-6">
        <div className="flex items-center">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User" />
            <AvatarFallback>{username?.substring(0, 2).toUpperCase() || 'JD'}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{username || 'Usuario'}</h2>
            <p className="text-sm text-muted-foreground">Amante de la comida • 15 reseñas</p>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="mr-2">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                Top Reseñador
              </Badge>
              {isVerifiedWallet && (
                <Badge variant="outline">
                  <svg className="h-3 w-3 mr-1" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2Z"
                      fill="currentColor"
                    />
                    <path
                      d="M16 6C10.477 6 6 10.477 6 16C6 21.523 10.477 26 16 26C21.523 26 26 21.523 26 16C26 10.477 21.523 6 16 6ZM16 22C12.686 22 10 19.314 10 16C10 12.686 12.686 10 16 10C19.314 10 22 12.686 22 16C22 19.314 19.314 22 16 22Z"
                      fill="white"
                    />
                  </svg>
                  Verificado
                </Badge>
              )}
            </div>
          </div>
        </div>

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
              Saldo de Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">8</div>
              <div className="text-sm text-muted-foreground">2 más para la siguiente recompensa</div>
            </div>
            <Progress value={80} className="h-2 mt-2" />

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" className="text-sm h-auto py-2">
                <Gift className="h-4 w-4 mr-2" />
                Canjear Tokens
              </Button>
              <Button variant="outline" className="text-sm h-auto py-2">
                <Star className="h-4 w-4 mr-2" />
                Ver Recompensas
              </Button>
            </div>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-lg font-semibold mb-3">Actividad reciente</h3>
          <div className="space-y-3">
            {/* ... (rest of your recent activity list) ... */}
          </div>
        </div>

        <Separator />

        <Button variant="outline" className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}