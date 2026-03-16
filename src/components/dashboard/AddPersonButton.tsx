'use client'

import { useState } from 'react'
import PersonModal from '@/components/people/PersonModal'

interface AddPersonButtonProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function AddPersonButton({ children, className, style }: AddPersonButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
        style={style}
      >
        {children ?? '+ Add person'}
      </button>
      <PersonModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
