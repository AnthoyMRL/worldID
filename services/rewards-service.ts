import Link from "next/link";
import { ChevronLeft, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
}

class RewardsService {
  private readonly REVIEW_REWARD_AMOUNT = 1; // Define the amount of your "non-value" currency per review

  async getUserTokenBalance(): Promise<{ success: boolean; message?: string; balance?: number }> {
    try {
      // Simulate fetching user token balance from local storage or an API
      const storedBalance = localStorage.getItem('reviewTokens');
      const balance = storedBalance ? parseInt(storedBalance, 10) : 0;
      return { success: true, balance };
    } catch (error: any) {
      console.error('Error fetching token balance:', error);
      return { success: false, message: error.message || 'An unexpected error occurred' };
    }
  }

  async giveReviewReward(): Promise<void> {
    try {
      const currentBalanceResult = await this.getUserTokenBalance();
      if (currentBalanceResult.success && currentBalanceResult.balance !== undefined) {
        const newBalance = currentBalanceResult.balance + this.REVIEW_REWARD_AMOUNT;
        localStorage.setItem('reviewTokens', newBalance.toString());
        // In a real application, you would likely update this on the server as well.
        console.log(`Awarded ${this.REVIEW_REWARD_AMOUNT} review tokens. New balance: ${newBalance}`);
      } else {
        console.error('Failed to retrieve current token balance.');
      }
    } catch (error: any) {
      console.error('Error giving review reward:', error);
    }
  }

  async getAvailableRewards(): Promise<{ success: boolean; message?: string; rewards?: Reward[] }> {
    try {
      // Simulate fetching available rewards from an API
      const rewards: Reward[] = [
        { id: 'discount10', name: '10% Off Your Next Meal', description: 'Valid at any participating restaurant', cost: 10 },
        { id: 'freeappetizer', name: 'Free Appetizer', description: 'With purchase of an entree', cost: 15 },
        { id: 'priorityres', name: 'Priority Reservations', description: 'Skip the wait at popular restaurants', cost: 20 },
        { id: 'freedessert', name: 'Free Dessert', description: 'At any participating restaurant', cost: 25 },
      ];
      return { success: true, rewards };
    } catch (error: any) {
      console.error('Error fetching available rewards:', error);
      return { success: false, message: error.message || 'An unexpected error occurred' };
    }
  }

  async redeemReward(rewardId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const rewardCost = this.getRewardCost(rewardId);
      if (rewardCost === null) {
        return { success: false, message: 'Invalid reward ID' };
      }

      const currentBalanceResult = await this.getUserTokenBalance();
      if (!currentBalanceResult.success || currentBalanceResult.balance === undefined || currentBalanceResult.balance < rewardCost) {
        return { success: false, message: 'Insufficient tokens' };
      }

      const newBalance = currentBalanceResult.balance - rewardCost;
      localStorage.setItem('reviewTokens', newBalance.toString());
      // In a real application, you would likely update this on the server.
      console.log(`Redeemed reward ${rewardId} for ${rewardCost} tokens. New balance: ${newBalance}`);
      return { success: true };
    } catch (error: any) {
      console.error('Error redeeming reward:', error);
      return { success: false, message: error.message || 'An unexpected error occurred during redemption' };
    }
  }

  private getRewardCost(rewardId: string): number | null {
    const rewards = [
      { id: 'discount10', cost: 10 },
      { id: 'freeappetizer', cost: 15 },
      { id: 'priorityres', cost: 20 },
      { id: 'freedessert', cost: 25 },
    ];
    const reward = rewards.find((r) => r.id === rewardId);
    return reward ? reward.cost : null;
  }
}

export const rewardsService = new RewardsService();