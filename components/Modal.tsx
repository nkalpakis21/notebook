"use client"

import { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Loader2 } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  onSubmit: () => void
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  onSubmit,
  value,
  onChange,
  isLoading
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter name"
          className="mt-4"
          disabled={isLoading}
        />

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading || !value.trim()}
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </span>
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 