'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutGrid, 
  FileText, 
  Users,
  Radio 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutGrid },
  { href: '/dashboard/moderation', label: 'Moderation Queue', icon: FileText },
  { href: '/dashboard/publishers', label: 'Publishers', icon: Users },
  { href: '/dashboard/live-streams', label: 'Live Streams', icon: Radio }, 
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        setIsCollapsed((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <aside 
      className={cn(
        "border-r border-border bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn(
        "flex transition-all overflow-hidden h-22",
        isCollapsed 
          ? "flex-col items-center justify-center gap-2 py-3" 
          : "flex-row items-center px-6 gap-1"
      )}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title="Toggle Sidebar (⌘+B or Ctrl+B)"
          className="dark:bg-black rounded-lg shrink-0 flex items-center justify-center p-0.5 hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-foreground/50 cursor-pointer"
        >
          <Image 
            src="/app_icon.png" 
            alt="Kyndara Icon" 
            width={32} 
            height={32} 
            className="object-contain"
          />
        </button>

        {!isCollapsed && (
          <h1 className="text-xl font-bold tracking-tight truncate select-none -ml-1">
            yndara
          </h1>
        )}
      </div>

      <div className={cn("h-px bg-sidebar-border shrink-0 transition-all duration-300 ease-in-out", isCollapsed ? "mx-4" : "mx-6")} />

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          
          const isActive = item.href === '/dashboard' 
            ? pathname === item.href 
            : pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isCollapsed ? 'justify-center px-2' : 'px-4',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className={cn("h-px bg-sidebar-border shrink-0 transition-all duration-300 ease-in-out", isCollapsed ? "mx-4" : "mx-6")} />

      <div className="p-4 text-xs text-sidebar-foreground/60 overflow-hidden whitespace-nowrap">
        {isCollapsed ? (
          <p className="text-center font-bold">K</p>
        ) : (
          <p className="text-center">© {new Date().getFullYear()} Kyndara</p>
        )}
      </div>
    </aside>
  )
}