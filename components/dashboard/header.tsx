'use client'

import { useAuth } from '@/app/hooks/useAuth'
import { useTheme } from 'next-themes'
import { Moon, Sun, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Header() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
   <header className="sticky top-0 z-40 bg-transparent">
      {/* 👇 FIX: Changed to justify-end since the title is gone */}
      <div className="flex items-center justify-end h-16 px-6">
        
        {/* Right side - Theme toggle and user menu */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                {/* 👇 FIX: Added app_icon.png with dark mode black background */}
                <Avatar className="h-8 w-8 dark:bg-black">
                  <AvatarImage 
                    src="/app_icon.png" 
                    alt="Kyndara Profile" 
                    className="object-contain p-0.5" 
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase() || 'K'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm">{user?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
