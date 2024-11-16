import '@/app/globals.css'
import { ClientLayout } from '@/components/client-layout'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata = {
  title: 'Animal Shelter Manager',
  description: 'Management system for animal shelters',
  openGraph: {
    title: 'Animal Shelter Manager',
    description: 'Management system for animal shelters',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}