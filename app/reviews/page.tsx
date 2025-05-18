"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { reviewService } from "@/services/review-service"
import { MiniKit, type VerifyCommandInput, VerificationLevel, type ISuccessResult } from "@worldcoin/minikit-js"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronLeft } from "lucide-react"

type Review = {
  id: string
  restaurant: string
  rating: number
  text: string
  verified: boolean
}

export default function ReviewsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [rating, setRating] = useState(0)
  const [verified, setVerified] = useState(false)
  const [restaurant, setRestaurant] = useState("")
  const [reviewText, setReviewText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)
  const [fieldsFilled, setFieldsFilled] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const verifyPayload: VerifyCommandInput = {
    action: "resena", // This is your action ID from the Developer Portal
    verification_level: VerificationLevel.Device, // Orb | Device
  }

  useEffect(() => {
    console.log("useEffect - verified:", verified, "canSubmit:", canSubmit)
    if (verified) {
      setCanSubmit(true)
    }
  }, [verified])

  useEffect(() => {
    // Check if all required fields are filled
    if (restaurant && rating > 0 && reviewText) {
      setFieldsFilled(true)
    } else {
      setFieldsFilled(false)
    }
  }, [restaurant, rating, reviewText])

  const handleVerify = async () => {
    if (!MiniKit.isInstalled()) {
      console.error("Worldcoin MiniKit no está instalado.")
      return
    }

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload)

      if (finalPayload.status === "error") {
        console.log("Error payload", finalPayload)
        return
      }

      // Verify the proof in the backend
      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload as ISuccessResult,
          action: "resena", // Ensure this matches your backend's expectation
          signal: "review-" + Date.now(),
        }),
      })

      if (!verifyResponse.ok) {
        console.error(`Verificacion del backend fallida con el estado: ${verifyResponse.status}`)
        return
      }

      const verifyResponseJson = await verifyResponse.json()
      console.log("Respuesta de verificacion del backend:", verifyResponseJson)

      if (verifyResponseJson.success) {
        console.log("Verificacion del backend exitosa")
        setVerified(true)
        setCanSubmit(true)
        // Optionally call handleSubmit here if you want to auto-submit after verification
        // handleSubmit();
      } else {
        console.error(
          "Verificacion del backend fallida:",
          verifyResponseJson.verifyRes?.error?.message || "Error desconocido",
        )
      }
    } catch (error) {
      console.error("Error durante la verificacion de World ID:", error)
    }
  }

  const fetchReviews = async () => {
    setLoading(true)
    const data = await reviewService.getAllReviews()
    setReviews(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  // Check for the submitted parameter in the URL
  useEffect(() => {
    const submitted = searchParams.get("submitted")
    if (submitted === "true") {
      setShowSuccessMessage(true)
      // Refetch reviews to include the newly submitted one
      fetchReviews()

      // Remove the query parameter after a short delay
      const timer = setTimeout(() => {
        router.replace("/reviews")
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false)
        }, 5000)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Inicio</span>
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Reseñas</h1>
        </div>
        <Link href="/reviews/new">
          <Button onClick={handleVerify}>Agregar Reseña</Button>
        </Link>
      </header>

      <div className="flex-1 p-4 space-y-4">
        {showSuccessMessage && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>¡Tu reseña ha sido enviada con éxito!</span>
          </div>
        )}

        {loading ? (
          <p className="text-muted-foreground">Cargando reseñas...</p>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground">Aún no hay reseñas.</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <CardTitle>{review.restaurant}</CardTitle>
                <CardDescription>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < review.rating ? "⭐" : "☆"}</span>
                  ))}
                  {review.verified && <span className="ml-2 text-green-600">(Verificado)</span>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{review.text}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}