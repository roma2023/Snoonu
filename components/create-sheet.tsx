"use client"

import { useApp } from "@/lib/app-context"
import { X, FileText, Camera } from "lucide-react"

export function CreateSheet() {
  const { state, updateState } = useApp()

  if (!state.showCreateSheet) return null

  const handleClose = () => {
    updateState({ showCreateSheet: false })
  }

  const handleCreatePost = () => {
    updateState({ showCreateSheet: false, showCreatePostSheet: true })
  }

  const handleCreateStory = () => {
    updateState({ showCreateSheet: false, showCreateStorySheet: true })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={handleClose}>
      <div
        className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Create</h2>
          <button onClick={handleClose} className="p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCreatePost}
            className="w-full flex items-center gap-4 p-4 bg-muted rounded-2xl text-left"
          >
            <div className="w-12 h-12 bg-snoonu-red/10 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-snoonu-red" />
            </div>
            <div>
              <h3 className="font-semibold">Create Post</h3>
              <p className="text-sm text-muted-foreground">Share a restaurant recommendation</p>
            </div>
          </button>

          <button
            onClick={handleCreateStory}
            className="w-full flex items-center gap-4 p-4 bg-muted rounded-2xl text-left"
          >
            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold">Create Story</h3>
              <p className="text-sm text-muted-foreground">Share a quick food moment</p>
            </div>
          </button>
        </div>

        <button onClick={handleClose} className="w-full mt-6 py-3 text-muted-foreground font-medium">
          Cancel
        </button>
      </div>
    </div>
  )
}
