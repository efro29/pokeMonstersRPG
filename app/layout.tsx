import React from "react"
import type { Metadata, Viewport } from 'next'
import { Press_Start_2P, Inter } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _pixel = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-pixel' })

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Pokemon RPG Companion',
  description: 'Companion app for tabletop Pokemon RPG with D20 mechanics',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Preload critical battle images so they render instantly */}
        <link rel="preload" href="/images/arenas/campo.gif" as="image" />
        <link rel="preload" href="/images/arenas/campo1.gif" as="image" />
        <link rel="preload" href="/images/pokebola.png" as="image" />
        <link rel="preload" href="/images/cardsTypes/genga.gif" as="image" />
        <link rel="preload" href="/images/cardsTypes/genga.jpg" as="image" />
        <link rel="preload" href="/images/cards/card0.png" as="image" />
        <link rel="preload" href="/images/cards/card1.png" as="image" />
        <link rel="preload" href="/images/cards/card2.png" as="image" />
        <link rel="preload" href="/images/cards/card3.png" as="image" />
        <link rel="preload" href="/images/cards/card4.png" as="image" />
        <link rel="preload" href="/images/cards/card5.png" as="image" />
        <link rel="preload" href="/images/cards/card6.png" as="image" />
        <link rel="preload" href="/images/cards/card7.png" as="image" />
        <link rel="preload" href="/images/cards/card8.png" as="image" />
        <link rel="preload" href="/images/cards/card9.png" as="image" />
        <link rel="preload" href="/images/cards/card10.png" as="image" />
        <link rel="preload" href="/images/cards/card11.png" as="image" />
        <link rel="preload" href="/images/cards/card12.png" as="image" />
        <link rel="preload" href="/images/cards/card13.png" as="image" />
        <link rel="preload" href="/images/cards/card14.png" as="image" />
        <link rel="preload" href="/images/cards/card15.png" as="image" />
        <link rel="preload" href="/images/cards/card16.png" as="image" />
        <link rel="preload" href="/images/cards/card17.png" as="image" />
      </head>
      <body className={`${_inter.variable} ${_pixel.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
