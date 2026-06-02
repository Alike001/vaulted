import { useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { Plus, ShieldCheck, KeyRound } from 'lucide-react'
import { ConnectBar } from '../components/ConnectBar'
import { Footer } from '../components/Footer'
import { NewSecretModal } from '../components/NewSecretModal'
import { SecretCard } from '../components/SecretCard'
import { secretsStore } from '../lib/storage'

export function Dashboard() {
  const { address, isConnected } = useAccount()
  const [modal, setModal] = useState(false)
  const [tick, setTick] = useState(0)
  const refresh = () => setTick((t) => t + 1)

  const secrets = useMemo(
    () => (address ? secretsStore.list(address) : []),
    [address, tick],
  )

  return (
    <div className="flex min-h-screen flex-col">
      <ConnectBar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Your secrets</h1>
            <p className="text-sm text-muted">
              Encrypted on-chain, decryptable only by the wallet you name.
            </p>
          </div>
          {isConnected && (
            <button className="btn-primary" onClick={() => setModal(true)}>
              <Plus className="h-4 w-4" /> New secret
            </button>
          )}
        </div>

        {!isConnected ? (
          <div className="card flex flex-col items-center gap-3 py-16 text-center">
            <ShieldCheck className="h-10 w-10 text-brand" />
            <p className="text-muted">Connect your wallet to create and reveal secrets.</p>
          </div>
        ) : secrets.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 py-16 text-center">
            <KeyRound className="h-10 w-10 text-muted" />
            <p className="font-display text-lg">No secrets yet</p>
            <p className="max-w-sm text-sm text-muted">
              Add your first API key — it&apos;ll be encrypted before it leaves this tab,
              then gated on-chain to exactly one wallet.
            </p>
            <button className="btn-primary mt-2" onClick={() => setModal(true)}>
              <Plus className="h-4 w-4" /> New secret
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {secrets.map((s) => (
              <SecretCard key={s.uuid} meta={s} onChanged={refresh} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      {modal && <NewSecretModal onClose={() => setModal(false)} onCreated={refresh} />}
    </div>
  )
}
