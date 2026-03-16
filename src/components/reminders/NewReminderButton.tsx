'use client'

import { useState } from 'react'
import ReminderModal from './ReminderModal'

interface NewReminderButtonProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function NewReminderButton({ children, className, style }: NewReminderButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
        style={style}
      >
        {children ?? 'New reminder'}
      </button>
      <ReminderModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
