class ReviewService {
    async submitReview(
      restaurant: string,
      rating: number,
      reviewText: string,
      verified: boolean,
      photos?: File[]
    ): Promise<{ success: boolean; message?: string; data?: any }> {
      try {
        // Simulate sending the review data to your backend API
        console.log("Submitting review data:", { restaurant, rating, reviewText, verified, photos });
  
        return { success: true, data: { message: "Review submitted successfully (simulated)" } };
  
      } catch (error: any) {
        console.error("Error submitting review:", error);
        return { success: false, message: error.message || "An unexpected error occurred" };
      }
    }
  
  }
  
  export const reviewService = new ReviewService();