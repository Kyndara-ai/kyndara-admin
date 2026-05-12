'use client'

import { useEffect, useState } from 'react'
import { fetchModerationQueue, approveContent, rejectContent, type ContentItem } from '@/app/lib/api'
import { ModerationTable } from '@/components/dashboard/moderation-table'
import { ReviewModal } from '@/components/dashboard/review-modal'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/use-toast'


export default function ModerationPage() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadQueue = async () => {
      try {
        const data = await fetchModerationQueue()
        const itemsWithStatus = data.map(item => ({
          ...item,
          status: item.status || 'pending'
        }))
        setItems(itemsWithStatus)
      } catch (error) {
        console.error('Failed to fetch moderation queue:', error)
        toast({
          title: 'Error',
          description: 'Failed to load moderation queue',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadQueue()
  }, [toast])

  const handleReview = (item: ContentItem) => {
    setSelectedContent(item)
    setIsModalOpen(true)
  }

  const handleApprove = async (id: string, reason?: string) => {
    try {
      await approveContent(id)
      setItems(items.filter((item) => item.id !== id))
      setIsModalOpen(false)
      toast({
        title: 'Success',
        description: 'Content approved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve content',
        variant: 'destructive',
      })
    }
  }

  const handleReject = async (id: string, reason?: string) => {
    try {
      await rejectContent(id)
      setItems(items.filter((item) => item.id !== id))
      setIsModalOpen(false)
      toast({
        title: 'Success',
        description: 'Content rejected',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject content',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Moderation Queue</h1>
        <p className="text-muted-foreground">
          Review and approve or reject pending content submissions.
        </p>
      </div>

      {/* Table */}
      <ModerationTable items={items} onReview={handleReview} />

      {/* Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedContent(null)
        }}
        content={selectedContent}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}
