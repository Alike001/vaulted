import { KeyRound, UserPlus, Eye, Ban } from 'lucide-react'
import { audit, type AuditType } from '../lib/audit'
import { shortAddr, timeAgo } from '../lib/format'

const ICON: Record<AuditType, typeof Eye> = {
  create: KeyRound,
  grant: UserPlus,
  read: Eye,
  denied: Ban,
}
const LABEL: Record<AuditType, string> = {
  create: 'created',
  grant: 'granted to',
  read: 'read by',
  denied: 'denied for',
}
const TONE: Record<AuditType, string> = {
  create: 'text-muted',
  grant: 'text-brand',
  read: 'text-ok',
  denied: 'text-danger',
}

export function AuditTimeline({ uuid }: { uuid: number }) {
  const events = audit.getTimeline(uuid)
  if (events.length === 0)
    return <p className="text-xs text-muted">No activity yet.</p>

  return (
    <ul className="space-y-2">
      {events.map((e, i) => {
        const Icon = ICON[e.type]
        return (
          <li key={i} className="flex items-center gap-2 text-xs">
            <Icon className={`h-3.5 w-3.5 shrink-0 ${TONE[e.type]}`} />
            <span className={TONE[e.type]}>{LABEL[e.type]}</span>
            <span className="font-mono text-muted">{shortAddr(e.addr)}</span>
            <span className="ml-auto text-muted">{timeAgo(e.ts)}</span>
          </li>
        )
      })}
    </ul>
  )
}
