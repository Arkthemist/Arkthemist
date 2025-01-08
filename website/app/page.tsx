import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Rounded Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-fit bg-card/95 backdrop-blur-sm rounded-full border border-border px-6 py-3 flex items-center gap-8 z-50">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="dark:invert"
          />
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-sm hover:text-accent transition-colors">Home</Link>
          <Link href="#" className="text-sm hover:text-accent transition-colors">Features</Link>
          <Link href="#" className="text-sm hover:text-accent transition-colors">Assets</Link>
          <Link href="#" className="text-sm hover:text-accent transition-colors">Pricing</Link>
          <Link href="#" className="text-sm hover:text-accent transition-colors">FAQ</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-48 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              One-click for Asset Defense
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Dive into the art assets, where innovative blockchain technology meets financial expertise
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/dashboard"
              className="px-8 py-3 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-center"
            >
              Open App
            </Link>
            <button className="px-8 py-3 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:bg-secondary transition-colors">
              Discover More
            </button>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {/* Card 1 */}
            <div className="group p-6 rounded-2xl bg-card border border-border hover:border-accent transition-colors">
              <div className="h-48 rounded-xl bg-secondary mb-4 overflow-hidden relative">
                {/* You can add feature images here */}
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Assets</h3>
              <p className="text-muted-foreground">Protect your digital assets with state-of-the-art blockchain technology</p>
            </div>

            {/* Card 2 */}
            <div className="group p-6 rounded-2xl bg-card border border-border hover:border-accent transition-colors">
              <div className="h-48 rounded-xl bg-secondary mb-4 overflow-hidden relative">
                {/* You can add feature images here */}
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Trading</h3>
              <p className="text-muted-foreground">Advanced trading features with real-time market insights</p>
            </div>

            {/* Card 3 */}
            <div className="group p-6 rounded-2xl bg-card border border-border hover:border-accent transition-colors">
              <div className="h-48 rounded-xl bg-secondary mb-4 overflow-hidden relative">
                {/* You can add feature images here */}
              </div>
              <h3 className="text-xl font-semibold mb-2">DeFi Integration</h3>
              <p className="text-muted-foreground">Seamless integration with leading DeFi protocols</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
