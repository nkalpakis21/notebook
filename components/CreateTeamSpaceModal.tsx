import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { X } from "lucide-react"

interface CreateTeamSpaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => void
}

export default function CreateTeamSpaceModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTeamSpaceModalProps) {
  const [teamSpaceName, setTeamSpaceName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (teamSpaceName.trim()) {
      try {
        setIsLoading(true)
        setError("")
        await onSubmit(teamSpaceName)
        setTeamSpaceName("")
        onClose()
      } catch (error) {
        setError("Failed to create team space. Please try again.")
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Create New Team Space</h2>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Team Space Name
            </label>
            <Input
              id="name"
              type="text"
              value={teamSpaceName}
              onChange={(e) => setTeamSpaceName(e.target.value)}
              placeholder="Enter team space name"
              className="w-full"
              autoFocus
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!teamSpaceName.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 