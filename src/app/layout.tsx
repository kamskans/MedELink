import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MedELink - Healthcare Management Platform',
  description: 'Find trusted and vetted specialists for your rehabilitation clients',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}