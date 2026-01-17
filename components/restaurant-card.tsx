"use client"

import type React from "react"

import { useApp } from "@/lib/app-context"
import type { Restaurant } from "@/lib/app-context"
import { Clock, MapPin, Star, Share2, ThumbsUp } from "lucide-react"

interface RestaurantCardProps {
  restaurant: Restaurant
  variant?: "compact" | "full"
  onSelect?: () => void
}

export function RestaurantCard({ restaurant, variant = "full", onSelect }: RestaurantCardProps) {
  const { updateState } = useApp()

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateState({
      selectedRestaurant: restaurant,
      showShareSheet: true,
    })
  }

  if (variant === "compact") {
    return (
      <button onClick={onSelect} className="min-w-[160px] bg-background rounded-2xl overflow-hidden text-left">
        <div className="relative">
          <img
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            className="w-full h-28 object-cover"
          />
          <div className="absolute top-2 left-2 bg-white/90 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <ThumbsUp className="w-3 h-3 text-green-600" />
            <span className="font-medium">{Math.round(restaurant.rating * 10)}%</span>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {restaurant.deliveryTime}
          </div>
          <button
            onClick={handleShare}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3">
          <p className="text-sm font-bold text-snoonu-red">{restaurant.priceLevel}</p>
          <h3 className="font-semibold text-sm truncate">{restaurant.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{restaurant.categories.join(", ")}</p>
        </div>
      </button>
    )
  }

  return (
    <button onClick={onSelect} className="w-full bg-background rounded-2xl overflow-hidden text-left">
      <div className="relative">
        <img src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} className="w-full h-48 object-cover" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {restaurant.deliveryTime}
          </div>
          <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {restaurant.distance}
          </div>
        </div>
        <button
          onClick={handleShare}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              {restaurant.isLocal && (
                <span className="bg-snoonu-red/10 text-snoonu-red text-xs px-2 py-0.5 rounded">S+</span>
              )}
              <span className="text-xs text-muted-foreground">ad</span>
              <h3 className="font-semibold">{restaurant.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {restaurant.priceLevel} · {restaurant.categories.join(", ")}
            </p>
            {restaurant.isLocal && <span className="text-snoonu-red text-xs font-medium">Support Local</span>}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-semibold">{restaurant.rating}</span>
          </div>
        </div>
      </div>
    </button>
  )
}
