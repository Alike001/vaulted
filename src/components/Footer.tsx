import { Code2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted sm:flex-row">
        <span>
          Built on{' '}
          <span className="text-ink">Story Confidential Data Rails</span> · Aeneid testnet
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Alike001/vaulted"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-ink"
          >
            <Code2 className="h-4 w-4" /> GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
