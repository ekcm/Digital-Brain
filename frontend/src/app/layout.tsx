import type { Metadata } from 'next'
import './globals.css'

import { SidebarContainer } from '@/components/ui/Sidebar/SidebarContainer'

export const metadata: Metadata = {
  title: 'Digital Brain',
  description: 'Your brain - made accessible',
  icons: [
    {
      rel: 'icon',
      url: '/brain.png',
    },
    {
      rel: 'shortcut icon',
      url: '/brain.png',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-50">
        <SidebarContainer>
          {children}
        </SidebarContainer>
      </body>
    </html>
  )
}
