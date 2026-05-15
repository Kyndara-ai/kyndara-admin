'use client'

import { useEffect, useState } from 'react'
import {
  fetchPublisherApplications,
  approvePublisher,
  rejectPublisher,
  type PublisherApplication,
} from '@/app/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Globe, Instagram, Twitter, Youtube, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// ─── Publisher Review Modal ───────────────────────────────────────────────────

function PublisherReviewModal({
  isOpen,
  onClose,
  publisher,
  onApprove,
  onReject,
}: {
  isOpen: boolean
  onClose: () => void
  publisher: PublisherApplication | null
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
}) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async () => {
    if (!publisher) return
    setIsProcessing(true)
    try {
      await onApprove(publisher.id)
      onClose()
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!publisher) return
    setIsProcessing(true)
    try {
      await onReject(publisher.id)
      onClose()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Publisher Application</DialogTitle>
          <DialogDescription>
            Review this publisher's application details before deciding.
          </DialogDescription>
        </DialogHeader>

        {publisher && (
          <div className="space-y-5">
            {/* Profile */}
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={publisher.avatarUrl} alt={publisher.displayName} />
                <AvatarFallback className="text-lg font-semibold">
                  {publisher.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground text-base">{publisher.displayName}</p>
                <p className="text-sm text-muted-foreground">{publisher.email}</p>
                {publisher.category && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {publisher.category}
                  </Badge>
                )}
              </div>
            </div>

            {/* Stats */}
            {(publisher.followerCount !== undefined || publisher.contentCount !== undefined) && (
              <div className="grid grid-cols-2 gap-3">
                {publisher.followerCount !== undefined && (
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-xl font-bold text-foreground">
                      {publisher.followerCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Followers</p>
                  </div>
                )}
                {publisher.contentCount !== undefined && (
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-xl font-bold text-foreground">
                      {publisher.contentCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Content Pieces</p>
                  </div>
                )}
              </div>
            )}

            {/* Bio */}
            {publisher.bio && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Bio</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{publisher.bio}</p>
              </div>
            )}

            {/* Links */}
            {(publisher.website || Object.values(publisher.socialLinks || {}).some(Boolean)) && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Links</p>
                <div className="flex flex-wrap gap-2">
                  {publisher.website && (
                    <a
                      href={publisher.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {publisher.socialLinks?.instagram && (
                    <a
                      href={`https://instagram.com/${publisher.socialLinks.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-pink-500 hover:underline"
                    >
                      <Instagram className="h-3.5 w-3.5" />
                      Instagram
                    </a>
                  )}
                  {publisher.socialLinks?.twitter && (
                    <a
                      href={`https://twitter.com/${publisher.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-sky-500 hover:underline"
                    >
                      <Twitter className="h-3.5 w-3.5" />
                      Twitter
                    </a>
                  )}
                  {publisher.socialLinks?.youtube && (
                    <a
                      href={`https://youtube.com/@${publisher.socialLinks.youtube}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:underline"
                    >
                      <Youtube className="h-3.5 w-3.5" />
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Applied date */}
            <p className="text-xs text-muted-foreground">
              Applied on{' '}
              {new Date(publisher.appliedDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-border">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? 'Rejecting...' : 'Reject'}
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? 'Approving...' : 'Approve'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Publishers Page ──────────────────────────────────────────────────────────

export default function PublishersPage() {
  const [applications, setApplications] = useState<PublisherApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<PublisherApplication | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPublisherApplications()
        setApplications(data)
      } catch (error) {
        console.error('Failed to fetch publisher applications:', error)
        toast({
          title: 'Error',
          description: 'Failed to load publisher applications',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [toast])

  const handleApprove = async (id: string) => {
    await approvePublisher(id)
    setApplications((prev) => prev.filter((a) => a.id !== id))
    toast({ title: 'Success', description: 'Publisher approved successfully' })
  }

  const handleReject = async (id: string) => {
    await rejectPublisher(id)
    setApplications((prev) => prev.filter((a) => a.id !== id))
    toast({ title: 'Done', description: 'Publisher application rejected' })
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Publishers</h1>
        <p className="text-muted-foreground">
          Review and verify new publisher applications.
        </p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Applicant</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={app.avatarUrl} alt={app.displayName} />
                      <AvatarFallback className="text-xs font-semibold">
                        {app.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{app.displayName}</p>
                      <p className="text-xs text-muted-foreground">{app.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {app.category ? (
                    <Badge variant="secondary" className="text-xs">
                      {app.category}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {app.followerCount !== undefined ? app.followerCount.toLocaleString() : '—'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(app.appliedDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelected(app)
                      setIsModalOpen(true)
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {applications.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No pending publisher applications
          </div>
        )}
      </div>

      <PublisherReviewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelected(null)
        }}
        publisher={selected}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}