'use client'

import { useState } from 'react'
import EntryModal from '@/components/entries/EntryModal'

export default function CaptureMomentButton() {
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsEntryModalOpen(true)}
        style={{
          background: '#7C3AED',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 20px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Capture a moment
      </button>
      <EntryModal isOpen={isEntryModalOpen} onClose={() => setIsEntryModalOpen(false)} />
    </>
  )
}
