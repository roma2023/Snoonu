"use client"

import { useState, useMemo } from "react"
import { useApp } from "@/lib/app-context"
import { CoinBadge } from "@/components/ui/coin-badge"
import { SectionHeader } from "@/components/ui/section-header"
import { Chip } from "@/components/ui/chip"
import { RecommendationCard } from "@/components/recommendation-card"
import { Plus, Users, Compass, Sparkles, TrendingUp, BadgeCheck, MessageCircle, Search, UserPlus, MoreHorizontal, UserMinus } from "lucide-react"
import { recommendations, friends, stories } from "@/lib/data"
import { ChatTab } from "./chat-tab"

// --- Mock Data for Experts (from snoocircle-2) ---
const EXPERT_SUGGESTIONS = [
  { id: 101, name: "Dr. Nour Saleh", avatar: "/placeholder.svg", role: "Dietitian", followers: "1K", verified: true },
  { id: 102, name: "Chef Hamad", avatar: "/placeholder.svg", role: "Celebrity Chef", followers: "2K", verified: true },
  { id: 103, name: "Fitness Ali", avatar: "/placeholder.svg", role: "Fitness Coach", followers: "500", verified: false },
  { id: 104, name: "Sara's Kitchen", avatar: "/placeholder.svg", role: "Food Blogger", followers: "3K", verified: true },
]

export function SnooCircleTab() {
  const { state, updateState } = useApp()
  const activeTab = state.snooCircleActiveTab

  const setActiveTab = (tab: "feed" | "chat" | "friends") => {
    updateState({ snooCircleActiveTab: tab })
  }

  return (
    <div className="flex flex-col bg-background">
      {/* Unified Sticky Header */}
      <div className="fixed top-0 left-0 right-0 max-w-md mx-auto z-50 bg-background border-b border-border shadow-sm">
        {/* App Bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">SnooCircle</h1>
          <CoinBadge />
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between space-x-2">
            <button 
              onClick={() => setActiveTab("feed")}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all ${
                activeTab === "feed" ? "bg-snoonu-red text-white" : "text-muted-foreground hover:text-foreground bg-muted/50"
              }`}
            >
              <span className="font-semibold text-sm">Feed</span>
            </button>

            <button 
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all ${
                activeTab === "chat" ? "bg-snoonu-red text-white" : "text-muted-foreground hover:text-foreground bg-muted/50"
              }`}
            >
              <MessageCircle size={18} fill={activeTab === "chat" ? "currentColor" : "none"} />
              <span className="font-semibold text-sm">Chat</span>
            </button>

            <button 
              onClick={() => setActiveTab("friends")}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all ${
                activeTab === "friends" ? "bg-snoonu-red text-white" : "text-muted-foreground hover:text-foreground bg-muted/50"
              }`}
            >
              <Users size={18} />
              <span className="font-semibold text-sm">Friends</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="pt-[115px]">
       {activeTab === "feed" && <FeedView />}
       {activeTab === "chat" && <ChatTabWrapper />}
       {activeTab === "friends" && <FriendsView />}
      </div>
    </div>
  )
}

function ChatTabWrapper() {
  // Wrapper to suppress header/margins if needed, or just render ChatTab
  // Since ChatTab has its own header "Messages", we might accept it for now.
  return <ChatTab />
}

function FeedView() {
  const { state, updateState } = useApp()
  const [activeSubTab, setActiveSubTab] = useState<"all" | "friends" | "whatsnoo" | "discover">("all")

  const handleStoryTap = (userId: string) => {
    updateState({
      showStoriesViewer: true,
      currentStoryUserId: userId,
      currentStoryIndex: 0,
    })
  }

  const handleYourStoryTap = () => {
    if (state.userStories.length > 0) {
      updateState({
        showStoriesViewer: true,
        currentStoryUserId: "me",
        currentStoryIndex: 0,
      })
    } else {
      updateState({ showCreateStorySheet: true })
    }
  }

  const handleUserTap = (userId: string) => {
    const user = friends.find((f) => f.id === userId)
    if (user) {
      updateState({
        currentPage: "user-profile",
        selectedUser: user,
      })
    }
  }

  const handleFabClick = () => {
    updateState({ showCreateSheet: true })
  }

  const getFilteredStories = useMemo(() => {
    switch (activeSubTab) {
      case "friends":
        return stories.filter((s) => {
          const user = friends.find((f) => f.id === s.userId)
          return user?.isFollowing
        })
      case "whatsnoo":
        return stories.filter((s) => {
          const restaurant = recommendations.find((r) => r.id === s.content.restaurantId)
          return restaurant?.isLocal
        })
      case "discover":
        return stories.filter((s) => {
          const user = friends.find((f) => f.id === s.userId)
          return user?.isVerified || (user?.followers && user.followers > 1000)
        })
      default:
        return stories
    }
  }, [activeSubTab])

  const getFilteredRecommendations = useMemo(() => {
    const allRecs = [...state.userPosts, ...recommendations]

    switch (activeSubTab) {
      case "friends":
        return allRecs.filter((r) => {
          if (r.recommenderId === "me") return true
          const recommender = friends.find((f) => f.id === r.recommenderId)
          return recommender?.isFollowing
        })
      case "whatsnoo":
        return allRecs.filter((r) => r.isLocal)
      case "discover":
        return allRecs.slice().sort((a, b) => b.rating - a.rating)
      default:
        return allRecs
    }
  }, [activeSubTab, state.userPosts])

  return (
    <div className="flex flex-col">
       {/* Coin Badge moved here since main header is gone? Or just inline? */}
       {/* Adding a small header row for Coins if needed, or just relying on subtabs */}


      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide pt-7">
        <Chip
          label="All"
          active={activeSubTab === "all"}
          icon={<Sparkles className="w-4 h-4" />}
          onClick={() => setActiveSubTab("all")}
        />
        <Chip
          label="Friends"
          active={activeSubTab === "friends"}
          icon={<Users className="w-4 h-4" />}
          onClick={() => setActiveSubTab("friends")}
        />
        <Chip
          label="WhatsNoo"
          active={activeSubTab === "whatsnoo"}
          icon={<Compass className="w-4 h-4" />}
          onClick={() => setActiveSubTab("whatsnoo")}
        />
        <Chip
          label="Discover"
          active={activeSubTab === "discover"}
          icon={<TrendingUp className="w-4 h-4" />}
          onClick={() => setActiveSubTab("discover")}
        />
      </div>

      <div className="py-2">
        <div className="px-4 pb-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            <button onClick={handleYourStoryTap} className="flex flex-col items-center gap-2 min-w-[72px]">
              {state.userStories.length > 0 ? (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-snoonu-red via-orange-500 to-amber-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-background p-0.5">
                    <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-semibold">H</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-snoonu-red flex items-center justify-center">
                   <Plus className="w-6 h-6 text-snoonu-red" />
                </div>
              )}
              <span className="text-xs font-medium text-snoonu-red">Hasan Jobs</span>
            </button>

            {/* Friend Stories */}
            {getFilteredStories.map((story) => {
              const friend = friends.find((f) => f.id === story.userId)
              return (
                <button
                  key={story.id}
                  onClick={() => handleStoryTap(story.userId)}
                  className="flex flex-col items-center gap-2 min-w-[72px]"
                >
                  <div
                    className={`w-16 h-16 rounded-full p-0.5 ${
                      story.isNew ? "bg-gradient-to-br from-snoonu-red via-orange-500 to-amber-500" : "bg-muted"
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-background p-0.5">
                      <div className="w-full h-full rounded-full bg-muted flex items-center justify-center relative">
                        <span className="text-lg font-semibold">{story.userName.charAt(0)}</span>
                        {friend?.isVerified && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-background flex items-center justify-center">
                            <BadgeCheck
                              className={`w-3.5 h-3.5 ${
                                friend.verificationBadge === "blue" ? "text-blue-500" : "text-snoonu-red"
                              }`}
                              fill={friend.verificationBadge === "blue" ? "#3b82f6" : "#E31837"}
                              stroke="white"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium truncate w-16 text-center">{story.userName}</span>
                </button>
              )
            })}

            {getFilteredStories.length === 0 && (
              <div className="flex items-center justify-center min-w-[200px] text-sm text-muted-foreground">
                No stories for this filter
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trending in your circle */}
      {(activeSubTab === "all" || activeSubTab === "friends") && (
        <div className="bg-muted/50 py-2">
          <SectionHeader title="Trending in your circle" onAction={() => {}} />
          <div className="px-4 pb-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {recommendations
                .filter((r) => r.recommendedBy && r.recommendedBy.length > 0)
                .slice(0, 4)
                .map((rec) => (
                  <div key={rec.id} className="min-w-[200px] bg-background rounded-2xl overflow-hidden shadow-sm">
                    <div className="relative">
                      <img src={rec.image || "/placeholder.svg"} alt={rec.name} className="w-full h-28 object-cover" />
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {rec.recommendedBy?.length} friends
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm truncate">{rec.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {rec.deliveryTime} · {rec.distance}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* WhatsNoo Info Banner */}
      {activeSubTab === "whatsnoo" && (
        <div className="mx-4 mb-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">New to You</h3>
          </div>
          <p className="text-sm text-amber-700">
            Restaurants your friends recently ordered from that you haven't tried yet. Discover hidden gems!
          </p>
        </div>
      )}

      {/* Discover Info Banner */}
      {activeSubTab === "discover" && (
        <div className="mx-4 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Trending Near You</h3>
          </div>
          <p className="text-sm text-blue-700">Popular picks in Doha based on what everyone's ordering right now.</p>
        </div>
      )}

      {/* Main Feed */}
      <div className="py-2 flex-1">
        <SectionHeader
          title={
            activeSubTab === "friends"
              ? "From Your Friends"
              : activeSubTab === "whatsnoo"
                ? "Hidden Gems"
                : activeSubTab === "discover"
                  ? "Trending Now"
                  : "Recent Recommendations"
          }
        />
        <div className="px-4 space-y-4">
          {getFilteredRecommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} onUserTap={handleUserTap} />
          ))}

          {getFilteredRecommendations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recommendations for this filter yet</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleFabClick}
        className="fixed bottom-24 right-4 w-14 h-14 bg-snoonu-red rounded-full flex items-center justify-center shadow-lg z-10 text-white"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  )
}

function FriendsView() {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="px-4 py-4 flex flex-col gap-6">
       {/* Search Bar */}
       <div className="flex items-center space-x-3 mb-2 mt-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search friends..." 
            className="w-full bg-muted text-foreground pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-snoonu-red placeholder:text-muted-foreground"
          />
        </div>
        <button className="w-12 h-12 bg-snoonu-red rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform shrink-0">
          <UserPlus className="w-5 h-5 text-white" />
        </button>
      </div>

       {/* Expert Suggestions */}
       <div>
        <h2 className="font-bold text-lg mb-3">Suggested Experts</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {EXPERT_SUGGESTIONS.map((expert) => (
            <div key={expert.id} className="flex flex-col items-center space-y-2 shrink-0 w-28">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                   <img src={expert.avatar} alt={expert.name} className="w-full h-full rounded-full object-cover" />
                </div>
                {expert.verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-snoonu-red rounded-full flex items-center justify-center border-2 border-background">
                    <BadgeCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-center truncate w-full">{expert.name}</span>
              <span className="text-snoonu-red text-[10px] font-medium">{expert.role}</span>
              <button className="bg-snoonu-red text-white text-xs px-4 py-1.5 rounded-full font-medium">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Friends List */}
      <div>
         <h2 className="font-bold text-lg mb-3">My Friends ({friends.length})</h2>
         <div className="space-y-3">
            {friends.map((friend) => (
               <div key={friend.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                     <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {/* Avatar */}
                         <span className="text-lg font-semibold">{friend.name.charAt(0)}</span>
                     </div>
                     <div>
                        <h3 className="font-semibold">{friend.name}</h3>
                        <p className="text-xs text-muted-foreground">{friend.mutualFriends} mutual friends</p>
                     </div>
                  </div>
                  
                  <button className="p-2 hover:bg-muted rounded-full">
                     <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                  </button>
               </div>
            ))}
         </div>
      </div>
    </div>
  )
}
