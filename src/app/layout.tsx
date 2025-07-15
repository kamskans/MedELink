import type { Metadata } from 'next'
import './globals.css'
import { StackProvider, StackTheme } from "@stackframe/stack"
import { stackClientApp } from "@/lib/stack"

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
      <body>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            {children}
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  )
}