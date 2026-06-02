import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePublicClient,
} from 'wagmi'
import { ShieldCheck, Wallet, LogOut } from 'lucide-react'
import { getNetworkStatus } from '../lib/cdr'
import { shortAddr } from '../lib/format'

export function ConnectBar() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const publicClient = usePublicClient()
  const [status, setStatus] = useState<string>('')

  const injected = connectors[0]

  useEffect(() => {
    let alive = true
    if (!isConnected || !publicClient) return
    getNetworkStatus(publicClient)
      .then((s) => {
        if (alive) setStatus(`CDR live · ${s.threshold}/${s.participants} validators`)
      })
      .catch(() => {
        if (alive) setStatus('CDR unreachable')
      })
    return () => {
      alive = false
    }
  }, [isConnected, publicClient])

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand" />
          <span className="font-display text-lg font-bold tracking-tight">Vaulted</span>
          <span className="hidden text-xs text-muted sm:inline">· encrypted secrets on CDR</span>
        </Link>

        <div className="flex items-center gap-3">
          {isConnected && status && (
            <span className="pill hidden text-ok sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              {status}
            </span>
          )}
          {isConnected ? (
            <>
              <span className="pill font-mono">{shortAddr(address)}</span>
              <button className="btn-ghost" onClick={() => disconnect()} title="Disconnect">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              className="btn-primary"
              disabled={isPending || !injected}
              onClick={() => injected && connect({ connector: injected })}
            >
              <Wallet className="h-4 w-4" />
              {isPending ? 'Connecting…' : 'Connect wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
