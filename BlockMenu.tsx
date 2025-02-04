import type React from "react"
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Image,
  Video,
  Music,
  File,
  Minus,
} from "lucide-react"
import type { BlockType, BlockMenuProps } from "./index"

export function BlockMenu({ onSelect }: BlockMenuProps) {
  const options: { type: BlockType; label: string; icon: React.ReactNode }[] = [
    { type: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
    { type: "heading1", label: "Heading 1", icon: <Heading1 className="h-4 w-4" /> },
    { type: "heading2", label: "Heading 2", icon: <Heading2 className="h-4 w-4" /> },
    { type: "heading3", label: "Heading 3", icon: <Heading3 className="h-4 w-4" /> },
    { type: "bulletList", label: "Bullet List", icon: <List className="h-4 w-4" /> },
    { type: "numberedList", label: "Numbered List", icon: <ListOrdered className="h-4 w-4" /> },
    { type: "todo", label: "To-do", icon: <CheckSquare className="h-4 w-4" /> },
    { type: "quote", label: "Quote", icon: <Quote className="h-4 w-4" /> },
    { type: "code", label: "Code", icon: <Code className="h-4 w-4" /> },
    { type: "image", label: "Image", icon: <Image className="h-4 w-4" /> },
    { type: "video", label: "Video", icon: <Video className="h-4 w-4" /> },
    { type: "audio", label: "Audio", icon: <Music className="h-4 w-4" /> },
    { type: "file", label: "File", icon: <File className="h-4 w-4" /> },
    { type: "divider", label: "Divider", icon: <Minus className="h-4 w-4" /> },
  ]

  // Rest of your component code...
}

