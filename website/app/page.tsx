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
                Resolve financial disputes on Starknet with an AI mediator trained with specialized legislation, ensuring transparent and fair conflict resolution
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
                    <h3 className="text-xl font-semibold mb-4">Get AI Legal Advice</h3>
                    <p className="text-muted-foreground">Consult our AI advisor trained in relevant law and cases to understand your case</p>
                  </div>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                      <span className="text-2xl font-bold text-accent">2</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Initiate Your Claim</h3>
                    <p className="text-muted-foreground">Start your dispute resolution process with clear documentation and evidence</p>
                  </div>
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                      <span className="text-2xl font-bold text-accent">3</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">AI Mediation</h3>
                    <p className="text-muted-foreground">Let our AI analyze evidence and deliver a fair, transparent resolution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-tr from-card via-card/50 to-accent/[0.12] border border-border backdrop-blur-sm p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-background/30 to-transparent"></div>
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="group p-6 rounded-2xl bg-gradient-to-tr from-card/90 via-card/70 to-accent/[0.08] border border-border hover:border-accent transition-all hover:shadow-[0_0_1rem_-0.25rem_theme(colors.accent.DEFAULT)] duration-300">
                    <div className="h-48 rounded-xl bg-gradient-to-tr from-secondary/80 to-secondary/30 mb-4 overflow-hidden relative">
                      {/* Feature image */}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Legal AI Expertise</h3>
                    <p className="text-muted-foreground">Advanced AI trained in Costa Rican law for accurate dispute resolution</p>
                  </div>
                  <div className="group p-6 rounded-2xl bg-gradient-to-tr from-card/90 via-card/70 to-accent/[0.08] border border-border hover:border-accent transition-all hover:shadow-[0_0_1rem_-0.25rem_theme(colors.accent.DEFAULT)] duration-300">
                    <div className="h-48 rounded-xl bg-gradient-to-tr from-secondary/80 to-secondary/30 mb-4 overflow-hidden relative">
                      {/* Feature image */}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Blockchain Security</h3>
                    <p className="text-muted-foreground">Immutable record-keeping and secure fund management on Starknet</p>
                  </div>
                  <div className="group p-6 rounded-2xl bg-gradient-to-tr from-card/90 via-card/70 to-accent/[0.08] border border-border hover:border-accent transition-all hover:shadow-[0_0_1rem_-0.25rem_theme(colors.accent.DEFAULT)] duration-300">
                    <div className="h-48 rounded-xl bg-gradient-to-tr from-secondary/80 to-secondary/30 mb-4 overflow-hidden relative">
                      {/* Feature image */}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Automated Resolution</h3>
                    <p className="text-muted-foreground">Swift and efficient dispute handling with transparent decision-making</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="px-4">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-tr from-card via-card/50 to-accent/[0.12] border border-border backdrop-blur-sm p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-background/30 to-transparent"></div>
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Use Cases</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-2xl bg-gradient-to-tr from-card/90 via-card/70 to-accent/[0.08] border border-border hover:border-accent transition-all hover:shadow-[0_0_1rem_-0.25rem_theme(colors.accent.DEFAULT)] duration-300">
                    <h3 className="text-2xl font-semibold mb-4">Financial Disputes</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="text-accent">•</span>
                        Contract disagreements
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent">•</span>
                        Payment disputes
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent">•</span>
                        Fund allocation conflicts
                      </li>
                    </ul>
                  </div>
                  <div className="p-8 rounded-2xl bg-gradient-to-tr from-card/90 via-card/70 to-accent/[0.08] border border-border hover:border-accent transition-all hover:shadow-[0_0_1rem_-0.25rem_theme(colors.accent.DEFAULT)] duration-300">
                    <h3 className="text-2xl font-semibold mb-4">Business Solutions</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="text-accent">•</span>
                        Automated mediation
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent">•</span>
                        Secure fund management
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent">•</span>
                        Legal compliance
                      </li>
                    </ul>
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
