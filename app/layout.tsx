import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Dream Realizer — Turn your dream into action with AI',
  description: 'Type your dream, get an interactive AI roadmap with the exact tools and prompts you need.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      {/* Runs before hydration to prevent flash of wrong theme */}
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}`
        }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
