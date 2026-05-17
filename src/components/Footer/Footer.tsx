import React from 'react'
import { FooterBrand } from './FooterBrand'
import { FooterLinks } from './FooterLinks'
import { FooterNewsletter } from './FooterNewsletter'
import { FooterBottom } from './FooterBottom'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-card/30 backdrop-blur-md border-t border-border/80 relative overflow-hidden select-none">
      <div className="container max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-1">
            <FooterBrand />
          </div>

          {/* Columns 2 & 3: Nav Links */}
          <div className="md:col-span-2">
            <FooterLinks />
          </div>

          {/* Column 4: Newsletter */}
          <div className="md:col-span-1">
            <FooterNewsletter />
          </div>
        </div>

        {/* Footer Bottom Portion */}
        <FooterBottom />
      </div>
    </footer>
  )
}
export default Footer
