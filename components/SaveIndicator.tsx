import { CheckCircle2, Loader2 } from "lucide-react"

interface SaveIndicatorProps {
  status: "saving" | "saved" | "idle"
}

export default function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === "idle") return null

  return (
    <div className="flex items-center text-sm text-gray-500 gap-1">
      {status === "saving" ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>Saved</span>
        </>
      )}
    </div>
  )
} 