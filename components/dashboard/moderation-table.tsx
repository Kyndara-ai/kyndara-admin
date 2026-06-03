'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { type ContentItem } from '@/app/lib/api'

interface ModerationTableProps {
  items: ContentItem[]
  onReview: (item: ContentItem) => void
}

// Added 'Post' color mapping
const typeColors: Record<string, string> = {
  Video:   'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  Article: 'bg-green-500/10 text-green-700 dark:text-green-400',
  Short:   'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  Audio:   'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  Post:    'bg-pink-500/10 text-pink-700 dark:text-pink-400', 
}

export function ModerationTable({ items, onReview }: ModerationTableProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Content Title</TableHead>
            <TableHead>Publisher</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium max-w-xs truncate">
                {item.title}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.publisher}
              </TableCell>
              <TableCell>
                <Badge className={typeColors[item.type] || 'bg-gray-500/10 text-gray-700'}>
                  {item.type}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(item.submittedDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onReview(item)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {items.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No items to review
        </div>
      )}
    </div>
  )
}