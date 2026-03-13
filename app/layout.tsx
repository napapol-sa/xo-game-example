"use client"

import { SessionProvider } from "next-auth/react"
import "./globals.css"

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}