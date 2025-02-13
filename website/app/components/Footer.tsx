import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <h2 className="text-lg font-semibold mb-4">About Us</h2>
            <p className="text-sm text-gray-300">
              Resolve financial disputes on Starknet with an AI mediator trained with specialized legislation, ensuring transparent and fair conflict resolution
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Dashboard", path: "/dashboard" }
              ].map(({ name, path }) => (
                <li key={name}>
                  <Link href={path} className="text-sm hover:text-gray-300 transition-colors">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            {/* <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
            <address className="text-sm text-gray-300 not-italic">
              <p>123 Main Street</p>
              <p>Anytown, USA 12345</p>
              <p>Email: info@example.com</p>
              <p>Phone: (123) 456-7890</p>
            </address> */}
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, label: "Twitter", link: "https://x.com/arkthemist" },
              ].map(({ icon: Icon, label, link }) => (
                <a key={label} href={link} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white transition-colors" aria-label={label}>
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Arkthemist. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

