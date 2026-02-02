import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Emily Boutique',
  description: 'Fashion boutique online store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
