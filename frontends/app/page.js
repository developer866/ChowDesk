import HomeClient from './components/HomeClient'
export const metadata = {
  title: 'ChowDesk – Order Food Online | Fresh, Fast Delivery in Lagos',
  description: 'Order fresh meals and drinks online with ChowDesk. Browse Starters, Mains, Drinks & Desserts, then order via WhatsApp — 30min delivery in Lekki, Lagos.',
  metadataBase: new URL('https://chow-desk.vercel.app'),
  openGraph: {
    title: 'ChowDesk – Order Food Online',
    description: 'Fresh meals, refreshing drinks, fast delivery — order via WhatsApp in seconds.',
    url: 'https://chow-desk.vercel.app',
    siteName: 'ChowDesk',
    images: ['/og-image.jpg'],
    locale: 'en_NG',
    type: 'website',
  },
}
function page() {
  return (
    <HomeClient />
  )
}

export default page