'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { type ContentItem } from '@/app/lib/api'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  content: ContentItem | null
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
}

const typeColors: Record<string, string> = {
  Video:   'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  Article: 'bg-green-500/10 text-green-700 dark:text-green-400',
  Short:   'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  Audio:   'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  Post:    'bg-pink-500/10 text-pink-700 dark:text-pink-400',
}

function VideoPreview({ src, poster }: { src?: string; poster?: string }) {
  if (!src) return <EmptyPreview label="No video available" />
  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
      <video
        key={src}
        src={src}
        poster={poster}
        controls
        className="w-full h-full object-contain"
      />
    </div>
  )
}

function ShortPreview({ src, poster }: { src?: string; poster?: string }) {
  return (
    <div className="flex justify-center py-2">
      <div className="relative w-55 rounded-[2.2rem] border-[6px] border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/40">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-1.5 rounded-full bg-zinc-700 z-10" />
        <div className="rounded-[1.7rem] overflow-hidden aspect-9/16 bg-black">
          {src ? (
            <video
              key={src}
              src={src}
              poster={poster}
              controls
              playsInline
              loop
              className="w-full h-full object-cover"
            />
          ) : poster ? (
            <img src={poster} alt="Short thumbnail" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500 text-xs">
              No preview
            </div>
          )}
        </div>
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-16 h-1 rounded-full bg-zinc-600" />
        </div>
      </div>
    </div>
  )
}

function ArticlePreview({
  thumbnail,
  title,
  description,
  publisher,
}: {
  thumbnail?: string
  title: string
  description: string
  publisher: string
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-52 object-cover"
        />
      ) : (
        <div className="w-full h-32 bg-muted flex items-center justify-center text-muted-foreground text-sm">
          No cover image
        </div>
      )}
      <div className="p-5 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {publisher}
        </p>
        <h2 className="text-lg font-bold text-foreground leading-snug">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

function AudioPreview({
  src,
  artwork,
  title,
  publisher,
}: {
  src?: string
  artwork?: string
  title: string
  publisher: string
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="w-44 h-44 rounded-2xl overflow-hidden bg-muted shadow-xl shadow-black/20 ring-1 ring-border">
        {artwork ? (
          <img src={artwork} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg viewBox="0 0 24 24" className="w-16 h-16 text-muted-foreground/30" fill="currentColor">
              <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z" />
            </svg>
          </div>
        )}
      </div>

      <div className="text-center space-y-0.5">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{publisher}</p>
      </div>

      {src ? (
        <audio key={src} src={src} controls className="w-full max-w-xs" />
      ) : (
        <p className="text-sm text-muted-foreground">No audio file available</p>
      )}
    </div>
  )
}

function PostPreview({
  mediaUrls,
  title,
  publisher,
}: {
  mediaUrls: string[]
  title: string
  publisher: string
}) {
  const isVideo = (url: string) => {
    const clean = url.split('?')[0].toLowerCase();
    return clean.endsWith('.mp4') || clean.endsWith('.mov') || clean.endsWith('.webm');
  };

  return (
    <div className="flex justify-center py-2">
      <div className="w-full max-w-sm rounded-xl border border-border overflow-hidden bg-card shadow-lg">
        {/* Post Carousel Container */}
        <div className="w-full aspect-4/5 bg-muted flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {mediaUrls && mediaUrls.length > 0 ? (
            mediaUrls.map((url, idx) => (
              <div key={idx} className="w-full h-full shrink-0 snap-center relative bg-black">
                {isVideo(url) ? (
                  <video 
                    src={url} 
                    controls 
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <img 
                    src={url} 
                    alt={`${title} media ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                )}
                {/* Carousel Indicator Pill */}
                {mediaUrls.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full z-10 backdrop-blur-md">
                    {idx + 1} / {mediaUrls.length}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="w-full flex items-center justify-center h-full text-muted-foreground text-sm">
              No media available
            </div>
          )}
        </div>
        
        {/* Post Footer */}
        <div className="p-4 bg-card">
          <p className="text-sm">
            <span className="font-bold text-foreground mr-2">{publisher}</span>
            <span className="text-muted-foreground">{title}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function EmptyPreview({ label }: { label: string }) {
  return (
    <div className="w-full aspect-video rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
      {label}
    </div>
  )
}

const dialogWidth: Record<string, string> = {
  Video:   'max-w-3xl',
  Short:   'max-w-sm',
  Article: 'max-w-2xl',
  Audio:   'max-w-md',
  Post:    'max-w-md',
}

export function ReviewModal({
  isOpen,
  onClose,
  content,
  onApprove,
  onReject,
}: ReviewModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async () => {
    if (!content) return
    setIsProcessing(true)
    try { await onApprove(content.id); onClose() }
    finally { setIsProcessing(false) }
  }

  const handleReject = async () => {
    if (!content) return
    setIsProcessing(true)
    try { await onReject(content.id); onClose() }
    finally { setIsProcessing(false) }
  }

  const widthClass = dialogWidth[content?.type ?? 'Video'] ?? 'max-w-2xl'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${widthClass} transition-all`}>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <DialogTitle className="truncate">{content?.title}</DialogTitle>
              <DialogDescription>
                {content?.publisher} •{' '}
                {content?.submittedDate
                  ? new Date(content.submittedDate).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })
                  : ''}
              </DialogDescription>
            </div>
            {content && (
              <Badge className={`${typeColors[content.type]} shrink-0 mt-0.5`}>
                {content.type}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {content && (
          <div className="space-y-5">
            {content.type === 'Video' && (
              <VideoPreview src={content.playbackUrl} poster={content.thumbnailUrl} />
            )}

            {content.type === 'Short' && (
              <ShortPreview src={content.playbackUrl} poster={content.thumbnailUrl} />
            )}

            {content.type === 'Article' && (
              <ArticlePreview
                thumbnail={content.thumbnailUrl}
                title={content.title}
                description={content.description}
                publisher={content.publisher}
              />
            )}

            {content.type === 'Audio' && (
              <AudioPreview
                src={content.playbackUrl}
                artwork={content.thumbnailUrl}
                title={content.title}
                publisher={content.publisher}
              />
            )}

            {content.type === 'Post' && (
              <PostPreview
                mediaUrls={content.mediaUrls || []}
                title={content.title}
                publisher={content.publisher}
              />
            )}

            {(content.type === 'Video' || content.type === 'Short' || content.type === 'Post') && content.description && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  {content.description}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2 border-t border-border">
              <Button variant="outline" onClick={onClose} disabled={isProcessing} className="flex-1">
                Close
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={isProcessing} className="flex-1">
                {isProcessing ? <><Spinner className="mr-2 h-4 w-4" />Rejecting...</> : 'Reject'}
              </Button>
              <Button onClick={handleApprove} disabled={isProcessing} className="flex-1 bg-green-600 hover:bg-green-700">
                {isProcessing ? <><Spinner className="mr-2 h-4 w-4" />Approving...</> : 'Approve'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}