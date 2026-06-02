// Vault METADATA only (never the secret — that lives encrypted on-chain).
// Names/addresses are non-sensitive, so localStorage keeps v1 serverless.

export interface SecretMeta {
  uuid: number
  name: string
  owner: `0x${string}`
  reader: `0x${string}` // the one wallet allowed to decrypt
  createdAt: number
  allocateTx?: string
}

const KEY = 'vaulted:secrets'

function readAll(): SecretMeta[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as SecretMeta[]
  } catch {
    return []
  }
}

function writeAll(list: SecretMeta[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export const secretsStore = {
  list(owner?: `0x${string}`): SecretMeta[] {
    const all = readAll().sort((a, b) => b.createdAt - a.createdAt)
    if (!owner) return all
    const lc = owner.toLowerCase()
    return all.filter(
      (s) => s.owner.toLowerCase() === lc || s.reader.toLowerCase() === lc,
    )
  },
  get(uuid: number): SecretMeta | undefined {
    return readAll().find((s) => s.uuid === uuid)
  },
  add(meta: SecretMeta) {
    const all = readAll().filter((s) => s.uuid !== meta.uuid)
    all.push(meta)
    writeAll(all)
  },
  remove(uuid: number) {
    writeAll(readAll().filter((s) => s.uuid !== uuid))
  },
}
