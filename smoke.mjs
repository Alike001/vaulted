// De-risk smoke test: does initWasm + live CDR testnet work end to end?
import { createPublicClient, http } from "viem";
import { CDRClient, initWasm } from "@piplabs/cdr-sdk";

const RPC = process.env.VITE_STORY_RPC || "https://aeneid.storyrpc.io";
const API = process.env.VITE_CDR_API_URL || "http://172.192.41.96:1317";

const log = (...a) => console.log("[smoke]", ...a);

try {
  log("initWasm...");
  await initWasm();
  log("initWasm OK");

  const publicClient = createPublicClient({ transport: http(RPC) });
  const chainId = await publicClient.getChainId();
  log("RPC OK, chainId =", chainId);

  const client = new CDRClient({ network: "testnet", publicClient, apiUrl: API });

  log("getActiveRound...");
  const round = await client.observer.getActiveRound();
  log("active round =", round);

  log("getGlobalPubKey...");
  const key = await client.observer.getGlobalPubKey();
  log("globalPubKey bytes =", key?.length, "prefix =", Buffer.from(key.slice(0, 2)).toString("hex"));

  log("getParticipantCount / threshold...");
  const [participants, threshold] = await Promise.all([
    client.observer.getParticipantCount(),
    client.observer.getThreshold(),
  ]);
  log("participants =", participants, "threshold =", threshold);

  log("ALL GOOD ✅ — SDK + WASM + live testnet reachable");
} catch (e) {
  log("FAILED ❌");
  console.error(e);
  process.exit(1);
}
