"use client"

import { useState } from "react"
import { useApp, type Recommendation } from "@/lib/app-context"
import { restaurants } from "@/lib/data"
import { X, Search, ChevronRight, Check } from "lucide-react"

export function CreatePostSheet() {
  const { state, updateState, addUserPost } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRestaurant, setSelectedRestaurant] = useState<(typeof restaurants)[0] | null>(null)
  const [caption, setCaption] = useState("")
  const [audience, setAudience] = useState<"all" | "friends">("all")
  const [showSuccess, setShowSuccess] = useState(false)

  if (!state.showCreatePostSheet) return null

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleClose = () => {
    updateState({ showCreatePostSheet: false })
    setSelectedRestaurant(null)
    setCaption("")
    setSearchQuery("")
  }

  const handlePost = () => {
    if (!selectedRestaurant) return

    const newPost: Recommendation = {
      id: `user-post-${Date.now()}`,
      name: selectedRestaurant.name,
      image: selectedRestaurant.image,
      rating: selectedRestaurant.rating,
      deliveryTime: selectedRestaurant.deliveryTime,
      distance: selectedRestaurant.distance,
      priceLevel: selectedRestaurant.priceLevel,
      categories: selectedRestaurant.categories,
      isLocal: selectedRestaurant.isLocal,
      note: caption || `Check out ${selectedRestaurant.name}!`,
      recommendedAt: "Just now",
      recommenderId: "me",
    }

    addUserPost(newPost)
    setShowSuccess(true)

    setTimeout(() => {
      setShowSuccess(false)
      handleClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={handleClose} className="p-2 -ml-2">
          <X className="w-6 h-6" />
        </button>
        <h1 className="font-semibold">Create Post</h1>
        <button
          onClick={handlePost}
          disabled={!selectedRestaurant}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            selectedRestaurant ? "bg-snoonu-red text-white" : "bg-muted text-muted-foreground"
          }`}
        >
          Post
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Search */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Restaurant</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for restaurants..."
              className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl text-sm outline-none"
            />
          </div>
        </div>

        {/* Selected Restaurant */}
        {selectedRestaurant && (
          <div className="bg-muted rounded-2xl p-3">
            <div className="flex items-center gap-3">
              <img
                src={selectedRestaurant.image || "/placeholder.svg"}
                alt={selectedRestaurant.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{selectedRestaurant.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedRestaurant.categories.slice(0, 2).join(" · ")}</p>
              </div>
              <button onClick={() => setSelectedRestaurant(null)} className="p-2">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* Restaurant List */}
        {!selectedRestaurant && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredRestaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => setSelectedRestaurant(restaurant)}
                className="w-full flex items-center gap-3 p-3 bg-muted rounded-xl text-left"
              >
                <img
                  src={restaurant.image || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{restaurant.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {restaurant.deliveryTime} · {restaurant.distance}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}

        {/* Caption */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Add a note (optional)</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, 120))}
            placeholder="Why do you recommend it?"
            className="w-full p-4 bg-muted rounded-xl text-sm outline-none resize-none h-24"
          />
          <p className="text-xs text-muted-foreground text-right mt-1">{caption.length}/120</p>
        </div>

        {/* Audience */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Who can see this?</label>
          <div className="flex gap-2">
            <button
              onClick={() => setAudience("all")}
              className={`flex-1 py-3 rounded-xl text-sm font-medium ${
                audience === "all" ? "bg-snoonu-red text-white" : "bg-muted text-foreground"
              }`}
            >
              Everyone
            </button>
            <button
              onClick={() => setAudience("friends")}
              className={`flex-1 py-3 rounded-xl text-sm font-medium ${
                audience === "friends" ? "bg-snoonu-red text-white" : "bg-muted text-foreground"
              }`}
            >
              Friends Only
            </button>
          </div>
        </div>

        {/* Reward Info */}
        <div className="bg-amber-50 rounded-2xl p-4">
          <p className="text-sm text-amber-800">If a friend orders from your link, you both earn SnooCoins!</p>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg">Posted!</h3>
            <p className="text-sm text-muted-foreground">Your recommendation is now live</p>
          </div>
        </div>
      )}
    </div>
  )
}
