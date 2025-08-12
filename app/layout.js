import './globals.css'

export const metadata = {
  title: 'Rightmove MVP',
  description: 'Minimal property portal starter',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
