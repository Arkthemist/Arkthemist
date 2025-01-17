import Image from "next/image";
import Link from "next/link";
import { MouseTrail } from "../components/ui/mouse-trail";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <MouseTrail />
      {/* Navbar remains the same */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-fit bg-card/95 backdrop-blur-sm rounded-full border border-border px-6 py-3 flex items-center gap-8 z-50">
        <div className="flex items-center gap-2">
          <Image
            src="/favicon.ico"
            alt="Logo"
            width={32}
            height={32}
          />
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-sm hover:text-accent transition-colors">Home</Link>
          <Link href="/login" className="text-sm hover:text-accent transition-colors">LogIn</Link>
        </div>
      </nav>

      <main className="flex flex-col gap-32 pb-32">
        {/* Hero Section */}
        <section className="pt-48 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Justice. Redefined.
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                Solve your conflicts without going to court
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login"
                className="px-8 py-3 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-center"
              >
                Open App
              </Link>
              <button className="px-8 py-3 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:bg-secondary transition-colors">
                Discover More
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-4">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-tr from-card via-card/50 to-accent/[0.12] border border-border backdrop-blur-sm p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-background/30 to-transparent"></div>
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                      <span className="text-2xl font-bold text-accent">1</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Connect Wallet</h3>
                    <p className="text-muted-foreground">Securely connect your wallet to access our platform&apos;s features</p>
                  </div>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                      <span className="text-2xl font-bold text-accent">2</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Create a case</h3>
                    <p className="text-muted-foreground">Submit your issue and let the AI fix it</p>
                  </div>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                      <span className="text-2xl font-bold text-accent">3</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Secure Resolution</h3>
                    <p className="text-muted-foreground">Let the AI manage your conflicts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
