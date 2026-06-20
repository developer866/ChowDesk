import React from 'react'
import Order from "../components/Order"

export const metadata = {
  title: 'My Orders – ChowDesk',
  description: 'View your order history on ChowDesk.',
  robots: {
    index: false,
    follow: false,
  },
}
function page() {


  return (
    <div>
      <Order />
    </div>
  )
}

export default page