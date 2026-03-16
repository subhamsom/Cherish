'use client'

import { useRouter } from 'next/navigation'
import Modal from '@/components/ui/Modal'
import PersonForm from './PersonForm'

interface PersonModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PersonModal({ isOpen, onClose }: PersonModalProps) {
  const router = useRouter()

  function handleSuccess() {
    onClose()
    router.refresh()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add person">
      <PersonForm onSuccess={handleSuccess} />
    </Modal>
  )
}
