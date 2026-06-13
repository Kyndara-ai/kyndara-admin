'use client'

import { useEffect, useState } from 'react'
import { fetchAllLiveStreams, deleteLiveStream, type LiveStreamAdmin } from '@/app/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function LiveStreamsPage() {
  const [streams, setStreams] = useState<LiveStreamAdmin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [streamToDelete, setStreamToDelete] = useState<LiveStreamAdmin | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadStreams()
  }, [])

  const loadStreams = async () => {
    try {
      setIsLoading(true)
      const data = await fetchAllLiveStreams()
      setStreams(data)
    } catch (error) {
      console.error('Failed to fetch live streams:', error)
      toast({
        title: 'Error',
        description: 'Failed to load live streams',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!streamToDelete) return
    setIsDeleting(true)

    try {
      await deleteLiveStream(streamToDelete.id)
      setStreams((prev) => prev.filter((s) => s.id !== streamToDelete.id))
      toast({
        title: 'Stream Deleted',
        description: 'The stream and associated AWS resources have been permanently removed.',
      })
    } catch (error: any) {
      toast({
        title: 'Deletion Failed',
        description: error.message || 'Failed to delete the live stream.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
      setStreamToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-100">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Live Streams</h1>
          <p className="text-muted-foreground">
            Manage and remove active or upcoming live circles.
          </p>
        </div>
        <Button variant="outline" onClick={loadStreams}>
          Refresh List
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Stream Info</TableHead>
              <TableHead>Publisher</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Schedule / Tier</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {streams.map((stream) => (
              <TableRow key={stream.id} className="hover:bg-muted/50 transition-colors">
                {/* Stream Info */}
                <TableCell>
                  <p className="font-medium text-sm text-foreground">{stream.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">ID: {stream.id.slice(0, 8)}...</p>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={stream.publisher.avatarUrl} alt={stream.publisher.displayName} />
                      <AvatarFallback className="text-xs font-semibold">
                        {stream.publisher.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{stream.publisher.displayName}</p>
                      {stream.publisher.email && (
                        <p className="text-xs text-muted-foreground">{stream.publisher.email}</p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge 
                    variant={stream.status === 'LIVE' ? 'destructive' : 'secondary'} 
                    className={stream.status === 'LIVE' ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}
                  >
                    {stream.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <p className="text-sm text-foreground">
                    {new Date(stream.scheduledStartTime).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stream.accessTier === 'SUBSCRIBER_ONLY' ? 'Subscribers Only' : 'Public'}
                  </p>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setStreamToDelete(stream)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {streams.length === 0 && (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <p>No active or upcoming streams found.</p>
          </div>
        )}
      </div>

      <Dialog open={!!streamToDelete} onOpenChange={(open) => !open && setStreamToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Live Stream?</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete <strong className="text-foreground">"{streamToDelete?.title}"</strong>? 
              This action cannot be undone and will immediately destroy the associated AWS streaming resources.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setStreamToDelete(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Yes, Delete Stream'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}