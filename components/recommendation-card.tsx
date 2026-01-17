"use client"

import { useApp } from "@/lib/app-context"
import type { Restaurant } from "@/lib/app-context"
import { Clock, MapPin, ThumbsUp, MessageCircle, Share2, BadgeCheck } from "lucide-react"
import { friends } from "@/lib/data"

interface RecommendationCardProps {
  recommendation: Restaurant & {
    note?: string
    recommendedAt?: string
    recommenderId?: string
    tags?: string[]
  }
  onUserTap?: (userId: string) => void
}

export function RecommendationCard({ recommendation, onUserTap }: RecommendationCardProps) {
  const { state, updateState } = useApp()

  const recommender =
    recommendation.recommenderId === "me"
      ? {
          id: "me",
          name: "Hasan Jobs",
          username: "Hasan Jobs",
          isVerified: false,
          verificationBadge: undefined,
          verificationTitle: undefined, 
          // Add other required User properties with default values or cast strict type if needed
          posts: 0,
          followers: 0,
          following: 0,
          recommendations: 0,
          mutualFriends: 0,
        }
      : friends.find((f) => f.id === recommendation.recommenderId) || friends[0]

  const handleOrder = () => {
    const cartItem = {
      id: "rec-item-1",
      name: recommendation.name + " Special",
      description: recommendation.note || "Recommended dish",
      price: 28,
      quantity: 1,
      image: recommendation.image,
    }

    updateState({
      showCartSheet: true,
      cartItems: [cartItem],
      cartRestaurantName: recommendation.name,
      selectedRestaurant: recommendation,
      referrer: recommender.name,
    })
  }

  const handleShare = () => {
    updateState({
      selectedRestaurant: recommendation,
      showShareSheet: true,
    })
  }

  const handleUserTap = () => {
    if (onUserTap) {
      onUserTap(recommender.id)
    }
  }

  const estimatedOrderTotal = 30
  const rewardCoins = Math.round(estimatedOrderTotal * 0.01 * 100)

  const getDisplayName = () => {
    if (recommender.isVerified && recommender.verificationBadge === "blue" && !recommender.name.startsWith("Dr.")) {
      return recommender.name // Already has Dr. in data
    }
    return recommender.name
  }

  return (
    <div className="bg-background rounded-2xl overflow-hidden border border-border">
      <div className="flex items-center gap-3 p-3">
        <button onClick={handleUserTap} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-snoonu-red to-amber-500 p-0.5">
            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-semibold">{recommender.name.charAt(0)}</span>
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              <p className="font-semibold text-sm">{getDisplayName()}</p>
              {recommender.isVerified && (
                <BadgeCheck
                  className={`w-4 h-4 ${recommender.verificationBadge === "blue" ? "text-blue-500" : "text-snoonu-red"}`}
                  fill={recommender.verificationBadge === "blue" ? "#3b82f6" : "#E31837"}
                  stroke="white"
                />
              )}
            </div>
            {recommender.verificationTitle ? (
              <p
                className={`text-xs ${recommender.verificationBadge === "blue" ? "text-blue-600" : "text-snoonu-red"}`}
              >
                {recommender.verificationTitle}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">{recommendation.recommendedAt || "2h ago"}</p>
            )}
          </div>
        </button>
        <div className="flex-1" />
        {recommendation.isLocal && (
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">New Gem</span>
        )}
      </div>

      {/* Image */}
      <img
        src={recommendation.image || "/placeholder.svg"}
        alt={recommendation.name}
        className="w-full h-44 object-cover"
      />

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold">{recommendation.name}</h3>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{recommendation.categories[0]}</span>
        </div>

        {recommendation.note && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">"{recommendation.note}"</p>
        )}

        {recommendation.tags && recommendation.tags.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {recommendation.tags.map((tag) => (
              <span key={tag} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {recommendation.deliveryTime}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {recommendation.distance}
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-4 mb-4">
          <button className="flex items-center gap-1 text-sm text-muted-foreground">
            <ThumbsUp className="w-4 h-4" />
            12
          </button>
          <button className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="w-4 h-4" />3
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={handleOrder} className="flex-1 bg-snoonu-red text-white py-3 rounded-full font-semibold">
            Order
          </button>
          <button
            onClick={handleShare}
            className="flex-1 border border-border py-3 rounded-full font-semibold flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        <div className="mt-3 bg-amber-50 rounded-full px-4 py-2 flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-full bg-snoonu-gold flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <p className="text-xs text-amber-800">Earn {rewardCoins}+ SnooCoins when your friend orders</p>
        </div>
      </div>
    </div>
  )
}
