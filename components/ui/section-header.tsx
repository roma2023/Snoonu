"use client"

interface SectionHeaderProps {
  title: string
  action?: string
  onAction?: () => void
}

export function SectionHeader({ title, action = "See all", onAction }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      {onAction && (
        <button onClick={onAction} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {action}
        </button>
      )}
    </div>
  )
}
