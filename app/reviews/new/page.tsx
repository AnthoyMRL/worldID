"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

export default function NewReviewPage() {
  const [name, setName] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [formValid, setFormValid] = useState(false)

  useEffect(() => {
    setFormValid(name.trim() !== "" && rating > 0 && comment.trim() !== "")
  }, [name, rating, comment])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    setImages(files)

    // Vista previa
    const previews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formValid) return

    // Aquí enviarías la información a tu API o base de datos
    console.log("Nombre:", name)
    console.log("Rating:", rating)
    console.log("Comentario:", comment)
    console.log("Imágenes:", images)

    alert("¡Reseña enviada!")
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dejar una reseña</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Nombre</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            required
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

        <div>
          <Label>Imágenes (opcional)</Label>
          <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {imagePreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`preview-${i}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={!formValid}>
          Enviar reseña
        </Button>
      </form>
    </div>
  )
}
