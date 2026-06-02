export type AuditType = 'create' | 'grant' | 'read' | 'denied'

export interface AuditEvent {
  uuid: number
  type: AuditType
  addr: string // actor (truncated for display by the UI)
  ts: number
  tx?: string
}

const KEY = 'vaulted:audit'

function readAll(): AuditEvent[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as AuditEvent[]
  } catch {
    return []
  }
}

export const audit = {
  add(ev: AuditEvent) {
    const all = readAll()
    all.push(ev)
    localStorage.setItem(KEY, JSON.stringify(all))
  },
  /** Newest-first timeline for one vault. */
  getTimeline(uuid: number): AuditEvent[] {
    return readAll()
      .filter((e) => e.uuid === uuid)
      .sort((a, b) => b.ts - a.ts)
  },
}
