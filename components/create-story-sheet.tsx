"use client"

import { useState } from "react"
import { useApp, type Story } from "@/lib/app-context"
import { restaurants } from "@/lib/data"
import { X, Search, ChevronRight, Check, Type } from "lucide-react"

export function CreateStorySheet() {
  const { state, updateState, addUserStory } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRestaurant, setSelectedRestaurant] = useState<(typeof restaurants)[0] | null>(null)
  const [textOverlay, setTextOverlay] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  if (!state.showCreateStorySheet) return null

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleClose = () => {
    updateState({ showCreateStorySheet: false })
    setSelectedRestaurant(null)
    setTextOverlay("")
    setSearchQuery("")
  }

  const handleShare = () => {
    if (!selectedRestaurant) return

    const newStory: Story = {
      id: `user-story-${Date.now()}`,
      userId: "me",
      userName: "Hasan Jobs",
      isNew: true,
      content: {
        type: "recommendation",
        restaurantId: selectedRestaurant.id,
        restaurantName: selectedRestaurant.name,
        restaurantImage: selectedRestaurant.image,
        restaurantRating: selectedRestaurant.rating,
        deliveryTime: selectedRestaurant.deliveryTime,
        note: textOverlay || `Check out ${selectedRestaurant.name}!`,
      },
    }

    addUserStory(newStory)
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
        <h1 className="font-semibold">Create Story</h1>
        <button
          onClick={handleShare}
          disabled={!selectedRestaurant}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            selectedRestaurant ? "bg-snoonu-red text-white" : "bg-muted text-muted-foreground"
          }`}
        >
          Share
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Preview */}
        {selectedRestaurant && (
          <div className="relative aspect-[9/16] max-h-[300px] rounded-2xl overflow-hidden bg-black">
            <img
              src={selectedRestaurant.image || "/placeholder.svg"}
              alt={selectedRestaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-semibold text-lg">{selectedRestaurant.name}</p>
              {textOverlay && <p className="text-white/90 text-sm mt-1">{textOverlay}</p>}
            </div>
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Search */}
        {!selectedRestaurant && (
          <>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Restaurant or Dish</label>
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

            {/* Restaurant List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
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
          </>
        )}

        {/* Text Overlay */}
        {selectedRestaurant && (
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Add text overlay (optional)
            </label>
            <input
              type="text"
              value={textOverlay}
              onChange={(e) => setTextOverlay(e.target.value.slice(0, 60))}
              placeholder="Add a short caption..."
              className="w-full p-4 bg-muted rounded-xl text-sm outline-none"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground text-right mt-1">{textOverlay.length}/60</p>
          </div>
        )}
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg">Story Shared!</h3>
            <p className="text-sm text-muted-foreground">Your story is now live</p>
          </div>
        </div>
      )}
    </div>
  )
}
