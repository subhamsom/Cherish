'use client'

import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'
import ReminderForm from './ReminderForm'

interface ReminderModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ReminderModal({ isOpen, onClose }: ReminderModalProps) {
  const router = useRouter()

  function handleSuccess() {
    onClose()
    router.refresh()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New reminder">
      <ReminderForm onSuccess={handleSuccess} />
    </Modal>
  )
}
