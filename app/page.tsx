import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold text-primary tracking-tight">
          Kyndara
        </h1>
        <h2 className="text-2xl font-medium text-muted-foreground">
          The Digital Sanctuary
        </h2>
        
        <p className="text-lg text-foreground leading-relaxed">
          Kyndara is a mindfulness and digital wellness application designed to create a peaceful, 
          secure space for families. Our platform offers curated educational content, stories, 
          yoga, and interactive learning paths to foster growth and positive values for both 
          parents and children.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/privacy" 
            className="text-primary hover:underline font-medium"
          >
            Privacy Policy
          </Link>
          <span className="hidden sm:inline text-muted-foreground">•</span>
          <a 
            href="mailto:support@kyndara.ai" 
            className="text-primary hover:underline font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>

      <div className="absolute top-6 right-6">
        <Link 
          href="/login" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Admin Login
        </Link>
      </div>
    </div>
  )
}