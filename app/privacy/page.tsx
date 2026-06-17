import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8 text-foreground">
        <Link 
          href="/" 
          className="text-primary hover:underline text-sm font-medium mb-8 inline-block"
        >
          &larr; Back to Home
        </Link>

        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Kyndara Privacy Policy</h1>
          <p className="text-muted-foreground italic">Effective Date: June 17, 2026</p>
        </div>
        
        <p className="text-lg">
          At Kyndara, accessible from <strong>kyndara.ai</strong>, one of our main priorities is the privacy of our visitors. 
          This Privacy Policy document contains types of information that is collected and recorded by Kyndara and how we use it.
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary border-b border-border pb-2">1. Information We Collect</h2>
          <p>When you sign up using your Google Account via OAuth, we collect the basic information provided by Google, including:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Your Email Address</li>
            <li>Your First and Last Name</li>
            <li>Your Profile Picture URL</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary border-b border-border pb-2">2. How We Use Your Information</h2>
          <p>We use the information we collect strictly to:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Create and authenticate your user account securely.</li>
            <li>Personalize your profile within the Kyndara application.</li>
            <li>Maintain, improve, and secure our authentication system.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary border-b border-border pb-2">3. Data Protection & Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal identification information to third parties. Your data is securely 
            stored on our cloud infrastructure and is used solely for providing application services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary border-b border-border pb-2">4. Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at{' '}
            <a href="mailto:support@kyndara.ai" className="text-primary hover:underline">support@kyndara.ai</a>.
          </p>
        </section>
      </div>
    </div>
  )
}