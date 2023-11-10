import { useEffect } from "react";
import { useState } from "react";
import { useConfig } from "wagmi";

export function useGetBlockHash({
  height,
  enabled = true,
}: {
  height?: bigint;
  enabled?: boolean;
}) {
  const [blockHash, setBlockHash] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const client = useConfig();

  useEffect(() => {
    (async () => {
      if (!enabled || !height) return;
      setLoading(true);
      const block = await client
        .getPublicClient({ chainId: client.lastUsedChainId })
        .getBlock({ blockNumber: BigInt(height) });
      setBlockHash(block.hash);
      setLoading(false);
    })();
  }, [height, client, enabled]);

  return { blockHash, loading };
}
