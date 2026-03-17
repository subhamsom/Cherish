'use client'

import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'
import ReminderForm from './ReminderForm'
import type { ReminderWithDetails } from '@/types'

interface ReminderModalProps {
  isOpen: boolean
  onClose: () => void
  editingReminder?: ReminderWithDetails | null
}

export default function ReminderModal({
  isOpen,
  onClose,
  editingReminder = null,
}: ReminderModalProps) {
  const router = useRouter()

  function handleSuccess() {
    onClose()
    router.refresh()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingReminder ? 'Edit reminder' : 'New reminder'}
    >
      <ReminderForm
        initialReminder={editingReminder}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  )
}
