import type { LucideIcon } from "lucide-react"

interface ActionButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  isLoading?: boolean
}

export function ActionButton({ 
  icon: Icon, 
  label, 
  onClick, 
  isLoading 
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center px-2 py-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </button>
  )
} 