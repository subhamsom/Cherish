'use client'

import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'
import EntryForm from './EntryForm'

interface EntryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EntryModal({ isOpen, onClose }: EntryModalProps) {
  const router = useRouter()

  function handleSuccess() {
    onClose()
    router.refresh()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Capture a moment">
      <EntryForm onSuccess={handleSuccess} />
    </Modal>
  )
}
