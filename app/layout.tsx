import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dream Realizer — Turn your dream into action with AI',
  description: 'Type your dream, get an interactive AI roadmap with the exact tools and prompts you need.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
