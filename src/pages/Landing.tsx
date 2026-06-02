import { Link } from 'react-router-dom'
import { ShieldCheck, Lock, UserCheck, Network, ArrowRight } from 'lucide-react'
import { ConnectBar } from '../components/ConnectBar'
import { Footer } from '../components/Footer'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { HyperText } from '@/components/ui/hyper-text'

const STEPS = [
  {
    icon: Lock,
    title: 'Encrypt in your browser',
    body: 'Your secret is encrypted to the validator network’s key before it ever leaves this tab.',
  },
  {
    icon: UserCheck,
    title: 'Grant one wallet',
    body: 'Name the exact wallet allowed to decrypt. Not even you, the creator, can read it.',
  },
  {
    icon: Network,
    title: 'Gated on-chain',
    body: 'A threshold of independent validators must agree before any decryption — no server holds the key.',
  },
]

export function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <ConnectBar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4">
        {/* Hero — animated beams behind, content above */}
        <section className="relative flex flex-col items-center overflow-hidden py-24 text-center">
          <BackgroundBeams className="opacity-60 [mask-image:radial-gradient(60%_50%_at_50%_40%,white,transparent)]" />
          <div className="relative z-10 flex flex-col items-center">
            <span className="pill mb-6 text-brand">
              <ShieldCheck className="h-3.5 w-3.5" /> Powered by Story Confidential Data Rails
            </span>
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Share secrets with one wallet.
            </h1>
            <HyperText
              as="div"
              duration={1200}
              animateOnHover
              className="mt-1 whitespace-nowrap py-0 text-center text-2xl font-bold tracking-tight text-brand sm:text-4xl md:text-5xl"
            >
              Nobody else can read them.
            </HyperText>
            <p className="mt-6 max-w-xl text-muted">
              Vaulted is an encrypted secrets manager for teams. Encrypt an API key once, grant
              access to a single wallet, and let a validator network — not a database — enforce who
              can decrypt.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/app" className="btn-primary">
                Launch app <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://docs.story.foundation/developers/cdr-sdk/overview"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                What is CDR?
              </a>
            </div>
            <p className="mt-5 font-mono text-xs text-muted">
              “I share the key — the one wallet I named decrypts it. I, the creator, get access
              denied.”
            </p>
          </div>
        </section>

        <section className="grid gap-4 pb-16 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.title} className="card">
              <s.icon className="mb-3 h-6 w-6 text-brand" />
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}
