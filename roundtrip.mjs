// Full round-trip de-risk: allocate + uploadCDR + accessCDR on live Aeneid.
// Needs a FUNDED Aeneid testnet wallet. Run:
//   PRIVATE_KEY=0xyourkey node roundtrip.mjs
// Get test funds first from the Story Aeneid faucet (ask in Discord #faucet if unsure).
import { createPublicClient, createWalletClient, http, encodeAbiParameters } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { CDRClient, initWasm } from "@piplabs/cdr-sdk";

const RPC = process.env.VITE_STORY_RPC || "https://aeneid.storyrpc.io";
const API = process.env.VITE_CDR_API_URL || "http://172.192.41.96:1317";
const OWNER_WRITE_CONDITION = "0x4C9bFC96d7092b590D497A191826C3dA2277c34B";
const PK = process.env.PRIVATE_KEY;
const log = (...a) => console.log("[roundtrip]", ...a);

if (!PK) { log("Set PRIVATE_KEY env (a funded Aeneid testnet wallet) and re-run."); process.exit(1); }

try {
  await initWasm();
  const account = privateKeyToAccount(PK);
  const owner = account.address;
  log("owner =", owner);

  const publicClient = createPublicClient({ transport: http(RPC) });
  const walletClient = createWalletClient({ account, transport: http(RPC) });
  const client = new CDRClient({ network: "testnet", publicClient, walletClient, apiUrl: API });

  const secret = "sk_test_VAULTED_" + owner.slice(2, 10);
  log("encrypting secret + allocating vault (owner-readable)...");
  const { uuid, txHashes } = await client.uploader.uploadCDR({
    dataKey: new TextEncoder().encode(secret),
    updatable: false,
    writeConditionAddr: OWNER_WRITE_CONDITION,
    writeConditionData: encodeAbiParameters([{ type: "address" }], [owner]),
    readConditionAddr: owner,            // EOA shortcut: only this wallet can read
    readConditionData: "0x",
    accessAuxData: "0x",
    // @ts-ignore - read EOA isn't a contract; skip SDK interface check
    skipConditionValidation: true,
  });
  log("vault uuid =", uuid, "allocate tx =", txHashes.allocate);

  log("reading back (this collects 3/5 validator partials)...");
  const { dataKey } = await client.consumer.accessCDR({ uuid, accessAuxData: "0x" });
  const recovered = new TextDecoder().decode(dataKey);
  log("recovered =", recovered);
  log(recovered === secret ? "ROUND TRIP OK ✅ — encrypt+grant+decrypt works on-chain" : "MISMATCH ❌");
} catch (e) {
  log("FAILED ❌"); console.error(e); process.exit(1);
}
