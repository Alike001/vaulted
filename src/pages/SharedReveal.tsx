import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import {
  Eye,
  Copy,
  Check,
  Loader2,
  Ban,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react'
import { ConnectBar } from '../components/ConnectBar'
import { Footer } from '../components/Footer'
import { readSecret, type ReadResult } from '../lib/secrets'
import { secretsStore } from '../lib/storage'
import { copy } from '../lib/format'

export function SharedReveal() {
  const { uuid: uuidStr } = useParams()
  const uuid = Number(uuidStr)
  const meta = secretsStore.get(uuid)

  const { isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<ReadResult | null>(null)
  const [copied, setCopied] = useState(false)

  async function reveal() {
    if (!publicClient || !walletClient) return
    setBusy(true)
    setResult(null)
    try {
      setResult(await readSecret(uuid, publicClient, walletClient))
    } finally {
      setBusy(false)
    }
  }

  async function onCopy() {
    if (result?.ok && (await copy(result.value))) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ConnectBar />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-12">
        <Link to="/app" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>

        <div className="card">
          <div className="mb-1 flex items-center gap-2 text-brand">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs uppercase tracking-wide">Encrypted secret · CDR vault #{Number.isNaN(uuid) ? '?' : uuid}</span>
          </div>
          <h1 className="font-display text-2xl font-bold">{meta?.name || 'Shared secret'}</h1>
          <p className="mb-6 text-sm text-muted">
            Only the wallet this secret was shared with can decrypt it.
          </p>

          <div className="mb-4 min-h-[56px] rounded-lg border border-border bg-panel2 px-4 py-3 font-mono text-sm">
            {result?.ok ? (
              <span className="break-all text-ok">{result.value}</span>
            ) : result && result.reason === 'denied' ? (
              <span className="flex items-center gap-2 text-danger">
                <Ban className="h-4 w-4" /> Access denied — this wallet isn&apos;t the recipient.
              </span>
            ) : result && !result.ok ? (
              <span className="text-warn">
                {result.reason === 'empty'
                  ? 'This vault has no data.'
                  : result.reason === 'timeout'
                    ? 'Validators didn’t respond in time — try again.'
                    : result.message.slice(0, 80)}
              </span>
            ) : (
              <span className="text-muted">••••••••••••••••••••</span>
            )}
          </div>

          {!isConnected ? (
            <p className="text-sm text-muted">Connect your wallet to attempt decryption.</p>
          ) : result?.ok ? (
            <button className="btn-ghost" onClick={onCopy}>
              {copied ? <Check className="h-4 w-4 text-ok" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy secret'}
            </button>
          ) : (
            <button className="btn-primary" onClick={reveal} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              {busy ? 'Collecting validator decryptions…' : result ? 'Try again' : 'Reveal secret'}
            </button>
          )}
        </div>

        {!meta && (
          <p className="mt-4 text-center text-xs text-muted">
            Note: this secret&apos;s metadata isn&apos;t in this browser, but if you&apos;re the
            recipient you can still decrypt vault #{uuid} by its id.
          </p>
        )}
      </main>
      <Footer />
    </div>
  )
}
