import { useState } from 'react'
import { isAddress } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { toast } from 'sonner'
import { X, Loader2, KeyRound, UserPlus } from 'lucide-react'
import { createSecret } from '../lib/secrets'
import type { SecretMeta } from '../lib/storage'

export function NewSecretModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (m: SecretMeta) => void
}) {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [reader, setReader] = useState('')
  const [busy, setBusy] = useState(false)

  const readerValid = isAddress(reader)
  const canSubmit = name.trim() && value.trim() && readerValid && !busy

  async function submit() {
    if (!publicClient || !walletClient || !address) {
      toast.error('Connect your wallet first')
      return
    }
    if (!readerValid) {
      toast.error('Enter a valid recipient wallet address')
      return
    }
    setBusy(true)
    const t = toast.loading('Encrypting locally → writing vault on-chain…')
    try {
      const meta = await createSecret({
        name: name.trim(),
        value: value.trim(),
        reader: reader as `0x${string}`,
        owner: address,
        publicClient,
        walletClient,
      })
      toast.success(`Vault #${meta.uuid} created`, { id: t })
      onCreated(meta)
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create vault', { id: t })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-card border border-border bg-panel p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <KeyRound className="h-5 w-5 text-brand" /> New secret
          </h2>
          <button onClick={onClose} className="text-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              className="input"
              placeholder="STRIPE_KEY"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Secret value</label>
            <textarea
              className="input min-h-[80px] font-mono text-xs"
              placeholder="sk_test_…"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted">
              Encrypted in your browser before it leaves this tab.
            </p>
          </div>
          <div>
            <label className="label">Recipient wallet (only this address can decrypt)</label>
            <div className="flex gap-2">
              <input
                className="input font-mono text-xs"
                placeholder="0x…"
                value={reader}
                onChange={(e) => setReader(e.target.value)}
              />
              {address && (
                <button
                  className="btn-ghost shrink-0"
                  type="button"
                  onClick={() => setReader(address)}
                  title="Use my address"
                >
                  <UserPlus className="h-4 w-4" /> Me
                </button>
              )}
            </div>
            {reader && !readerValid && (
              <p className="mt-1 text-xs text-danger">Not a valid address.</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button className="btn-primary" onClick={submit} disabled={!canSubmit}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? 'Writing vault…' : 'Encrypt & save'}
          </button>
        </div>
      </div>
    </div>
  )
}
