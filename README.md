# Vaulted

**Stop pasting API keys into Slack. Encrypt a secret once, grant it to exactly one wallet, and let a validator network — not a database — decide who can read it.**

**[▶ Watch the 2-minute demo](https://youtu.be/qrcbXeCcaPI)**

**Live demo: [vaulted-lovat.vercel.app](https://vaulted-lovat.vercel.app/)**

*Built for the CDR Hackathon 2026 (Story · Confidential Data Rails) — Best CDR Application (Track 2). Built entirely on Story's `@piplabs/cdr-sdk`.*

---

## The problem

Teams still share their most sensitive credentials — Stripe keys, database URLs, `.env` files — over Slack, email, and shared password-manager seats. Once a key lands in a DM, it's plaintext sitting in someone's chat history forever: impossible to truly revoke, invisible to audit, and trusted to whatever SaaS company holds the vault. The people who feel this pain most are developers, and right now their only options ask them to trust a company's database not to leak, get breached, or get subpoenaed.

## The solution

Vaulted is an encrypted secrets manager where access control is enforced on-chain instead of by a server. A secret is threshold-encrypted in your browser to a validator network's key, written to an on-chain vault gated to a single wallet, and can only be decrypted by that exact wallet — not by you, the creator, and not by any server. Even the person who created the secret gets "access denied" unless they named themselves the reader.

## Quick start

```bash
git clone https://github.com/Alike001/vaulted.git
cd vaulted
npm install
cp .env.example .env
npm run dev
```

Then open [localhost:5173](http://localhost:5173).

You need a wallet (MetaMask) with **Story Aeneid testnet** funds — the encrypt/grant/read flow pays on-chain fees. Set the values in `.env` from `.env.example` (RPC, chain id `1315`, and the CDR REST node — confirm the current node address in the hackathon Discord).

## Stack

| Layer | Technology |
| ----- | ---------- |
| Confidential data | **`@piplabs/cdr-sdk` v0.2.1** — Story Confidential Data Rails (threshold encryption, on-chain vaults, validator decryption) |
| Chain | **Story Aeneid testnet** (chainId `1315`) |
| Chain client | viem 2 |
| Wallet | wagmi 3 (injected connector only) |
| Frontend | React 19 + Vite 8 + TypeScript 6 |
| Routing | React Router 7 (SPA) |
| Styling | Tailwind CSS 3 + design tokens, Space Grotesk / Inter / JetBrains Mono |
| Motion / UI | motion (Framer), lucide-react, sonner |
| Deploy | Vercel (static build + same-origin proxy to the CDR node) |

## How it works

```
  Browser (creator)                  Story Aeneid testnet                Validator network (DKG)
 ┌──────────────────┐    allocate    ┌─────────────────────┐
 │ encrypt secret   │ ─────────────► │ CDR vault (uuid)    │
 │ to DKG key       │    write       │ readCondition =     │
 │ readCond = 0xB   │ ─────────────► │   wallet 0xB        │
 └──────────────────┘                └─────────────────────┘
                                               │
  Browser (reader 0xB)   accessCDR (read tx)   ▼            collect partials (3 of 5)
 ┌──────────────────┐ ─────────────────────────────────►  validators each produce a
 │ request decrypt  │                                       partial decryption ONLY if
 │ get plaintext ◄──┼────── combine partials ◄────────────  the requester == readCondition
 └──────────────────┘
  Any other wallet  → 0 partials produced → "Access denied"
```

A secret is encrypted to the validator network's distributed key (DKG) in the browser, then written to an on-chain vault whose **read condition is set to one specific wallet address** (an EOA read gate — no custom Solidity needed). To reveal, the reader sends a read transaction; each validator produces a *partial* decryption **only if the requester is the named reader**, and the browser combines a threshold of partials (3 of 5) into the plaintext. An unauthorized wallet receives zero partials — decryption is impossible, not just hidden. Vault metadata (name, uuid, granted address) lives in `localStorage`; the secret itself never exists in plaintext anywhere but the authorized reader's browser.

## Sponsor / track alignment

- **Story — Best CDR Application (Track 2)** — Vaulted is built end-to-end on `@piplabs/cdr-sdk`: every secret is a threshold-encrypted CDR vault with an on-chain read condition. It implements the whitepaper's flagship "Secure API Key Distribution" use case — credentials as on-chain assets, distributed only to valid holders, with protocol-level access control replacing chat and email.
- **Real, not theater** — the reveal calls the live `accessCDR` flow against the validator network; there is no mock encryption or fake "decrypting…" animation. The creator-cannot-read demo proves the gate is cryptographic, not UI.
- **Traction signal** — deployed to a public URL with the full create → grant → reveal → audit loop a developer would actually use twice.

## Future roadmap

- **Live revoke + multi-reader vaults** via a custom mutable `AllowlistReadCondition` contract (also unlocks Track 1) — EOA-gated reads are per-recipient and can't be revoked after grant; a contract condition fixes both.
- **Time-expiring access** — a time-based read condition so access auto-revokes after N hours.
- **Encrypted file secrets** — extend beyond text to `.env` files and certificates.
- **Hosted metadata** — replace `localStorage` with a small KV so a team shares one vault index across devices.
- **Token-gated secrets** — grant access to anyone holding a given NFT or token, not just a named wallet.

## Team

- **Hammed Ali Oyeleye** — Frontend + on-chain integration — [GitHub](https://github.com/Alike001) · [Telegram](https://t.me/IamAlikeX)

## Acknowledgements

Built on [Story Protocol](https://story.foundation)'s Confidential Data Rails and the `@piplabs/cdr-sdk`. Thanks to the CDR Hackathon organizers and the validator network running the Aeneid testnet DKG.
