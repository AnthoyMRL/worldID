"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { rewardsService } from "@/services/rewards-service";
import CoinImage from "@/image/Coin.jpg"; // Importa tu imagen

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
}

export default function RewardsPage() {
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [redeemingReward, setRedeemingReward] = useState<string | null>(null);

  const fetchRewardsData = async () => {
    setLoadingBalance(true);
    setLoadingRewards(true);

    const balanceResult = await rewardsService.getUserTokenBalance();
    if (balanceResult.success && balanceResult.balance !== undefined) {
      setTokenBalance(balanceResult.balance);
    } else if (balanceResult.message) {
      console.error("Error al obtener el balance:", balanceResult.message);
    }
    setLoadingBalance(false);

    const rewardsResult = await rewardsService.getAvailableRewards();
    if (rewardsResult.success && rewardsResult.rewards) {
      setAvailableRewards(rewardsResult.rewards);
    } else if (rewardsResult.message) {
      console.error("Error al obtener las recompensas:", rewardsResult.message);
    }
    setLoadingRewards(false);
  };

  useEffect(() => {
    fetchRewardsData();
  }, []);

  const handleRedeemReward = async (rewardId: string, cost: number) => {
    if (tokenBalance === null || tokenBalance < cost || redeemingReward === rewardId) {
      // Optionally show a message if balance is insufficient or already redeeming
      return;
    }

    setRedeemingReward(rewardId);
    const redeemResult = await rewardsService.redeemReward(rewardId);
    setRedeemingReward(null);

    if (redeemResult.success) {
      // Optionally show a success message and refresh data
      fetchRewardsData();
    } else if (redeemResult.message) {
      console.error("Error al canjear recompensa:", redeemResult.message);
      // Optionally display an error to the user
    }
  };

  const progressValue = tokenBalance !== null ? Math.min(tokenBalance * 10, 100) : 0; // Example progress calculation
  const tokensNeededForNextReward = tokenBalance !== null ? 10 - (tokenBalance % 10) : 10; // Example logic

  if (loadingBalance || loadingRewards) {
    return <div>Cargando datos de recompensas...</div>; 
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="px-4 py-3 border-b flex items-center">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Atras</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Recompensas</h1>
      </header>

      <div className="flex-1 p-4 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Image src={CoinImage} alt="Token Icon" className="h-5 w-5 mr-2" width={20} height={20} />
              Balance de Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{tokenBalance !== null ? tokenBalance : 0}</div>
              <div className="text-sm text-muted-foreground">
                {tokenBalance !== null ? `${tokensNeededForNextReward} mas para la siguiente recompensa` : '0 mas para la siguiente recompensa'}
              </div>
            </div>
            <Progress value={progressValue} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-semibold mb-3">Recompensas disponibles</h2>
          <div className="space-y-3">
            {availableRewards.map((reward) => (
              <Card key={reward.id}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <Gift className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">{reward.name}</h3>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
                  <Badge variant="secondary">{reward.cost} Tokens</Badge>
                  <Button
                    size="sm"
                    onClick={() => handleRedeemReward(reward.id, reward.cost)}
                    disabled={tokenBalance === null || tokenBalance < reward.cost || redeemingReward === reward.id}
                  >
                    {redeemingReward === reward.id ? 'Canjeando...' : 'Canjear'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}