export type BlockType =
  | "text"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bulletList"
  | "numberedList"
  | "todo"
  | "quote"
  | "code"
  | "image"
  | "video"
  | "audio"
  | "file"
  | "divider"

// You can also add the BlockMenuProps type here if it's not defined elsewhere
export interface BlockMenuProps {
  onSelect: (type: BlockType) => void
}

// If you need to export any icons, you can do so here
// For example:
// export { Type, Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare, Quote, Code, Image, Video, Music, File, Minus } from 'lucide-react';

