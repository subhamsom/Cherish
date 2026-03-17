'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ToastItem {
  id: string
  message: string
  undo?: () => void
  durationMs?: number
}

interface ToastProps {
  item: ToastItem | null
  onDismiss: () => void
}

const TOAST_DURATION_MS = 6000

export default function Toast({ item, onDismiss }: ToastProps) {
  const duration = item?.durationMs ?? TOAST_DURATION_MS

  useEffect(() => {
    if (!item) return
    const t = setTimeout(onDismiss, duration)
    return () => clearTimeout(t)
  }, [item?.id, duration, onDismiss])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: 'tween', duration: 0.2 }}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem 0.75rem 1.25rem',
            background: 'var(--text-primary)',
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            maxWidth: 'min(90vw, 360px)',
          }}
        >
          <span style={{ flex: 1 }}>{item.message}</span>
          {item.undo && (
            <button
              type="button"
              onClick={() => {
                item.undo?.()
                onDismiss()
              }}
              style={{
                padding: '0.35rem 0.65rem',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              Undo
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
