import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePublicClient, useWalletClient } from 'wagmi'
import { toast } from 'sonner'
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Loader2,
  Trash2,
  ExternalLink,
  History,
  Ban,
} from 'lucide-react'
import { readSecret, type ReadResult } from '../lib/secrets'
import type { SecretMeta } from '../lib/storage'
import { secretsStore } from '../lib/storage'
import { audit } from '../lib/audit'
import { shortAddr, copy } from '../lib/format'
import { AuditTimeline } from './AuditTimeline'

const explorer = import.meta.env.VITE_EXPLORER_URL

export function SecretCard({
  meta,
  onChanged,
}: {
  meta: SecretMeta
  onChanged: () => void
}) {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const [value, setValue] = useState<string | null>(null)
  const [result, setResult] = useState<ReadResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showAudit, setShowAudit] = useState(false)

  async function reveal() {
    if (!publicClient || !walletClient) {
      toast.error('Connect your wallet first')
      return
    }
    setBusy(true)
    setResult(null)
    try {
      const r = await readSecret(meta.uuid, publicClient, walletClient)
      setResult(r)
      if (r.ok) setValue(r.value)
    } finally {
      setBusy(false)
    }
  }

  async function onCopy() {
    if (!value) return
    if (await copy(value)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  function remove() {
    secretsStore.remove(meta.uuid)
    onChanged()
  }

  const denied = result && !result.ok && result.reason === 'denied'

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">{meta.name}</h3>
          <p className="text-xs text-muted">
            Vault #{meta.uuid} · shared with{' '}
            <span className="font-mono text-ink">{shortAddr(meta.reader)}</span>
          </p>
        </div>
        <button onClick={remove} className="text-muted hover:text-danger" title="Remove from list">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="rounded-lg border border-border bg-panel2 px-3 py-2 font-mono text-sm">
        {value ? (
          <span className="break-all text-ok">{value}</span>
        ) : denied ? (
          <span className="flex items-center gap-2 text-danger">
            <Ban className="h-4 w-4" /> Access denied — this wallet can&apos;t decrypt
          </span>
        ) : result && !result.ok ? (
          <span className="text-warn">{result.reason}: {result.message.slice(0, 60)}</span>
        ) : (
          <span className="text-muted">••••••••••••••••</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {value ? (
          <>
            <button className="btn-ghost" onClick={() => setValue(null)}>
              <EyeOff className="h-4 w-4" /> Hide
            </button>
            <button className="btn-ghost" onClick={onCopy}>
              {copied ? <Check className="h-4 w-4 text-ok" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={reveal} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            {busy ? 'Collecting validator decryptions…' : 'Reveal'}
          </button>
        )}
        {denied && (
          <button className="btn-ghost" onClick={reveal} disabled={busy}>
            Retry
          </button>
        )}
        <Link to={`/s/${meta.uuid}`} className="btn-ghost">
          Share link
        </Link>
        <button className="btn-ghost" onClick={() => setShowAudit((s) => !s)}>
          <History className="h-4 w-4" /> Audit
        </button>
        {explorer && meta.allocateTx && (
          <a
            className="btn-ghost"
            href={`${explorer}/tx/${meta.allocateTx}`}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="h-4 w-4" /> Tx
          </a>
        )}
      </div>

      {showAudit && (
        <div className="border-t border-border pt-3">
          <AuditTimeline uuid={meta.uuid} key={audit.getTimeline(meta.uuid).length} />
        </div>
      )}
    </div>
  )
}
