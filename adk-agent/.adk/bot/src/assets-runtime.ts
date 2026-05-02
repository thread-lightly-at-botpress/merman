
// Auto-generated assets metadata
import { Asset, initAssets, client } from '@botpress/runtime/runtime';

// Static asset metadata (populated at build time)
export const assetsMetadata: Record<string, Asset> = {};

// Local hashes from cache
export const localHashes: Record<string, string> = {};

// Initialize the assets runtime with metadata and local hashes
// The global object should be passed by the agent initialization code
export function initializeAssets(globalObj: any = globalThis) {
  const refresher = async (): Promise<Record<string, Partial<Asset>>> => {
  const updates: Record<string, Partial<Asset>> = {};
  let nextToken: string | undefined;
  do {
    const { files, meta } = await client.listFiles({
      tags: { adk: 'true', type: 'asset' },
      nextToken,
    });
    for (const f of files) {
      const p = f.tags?.path;
      if (p) {
        updates[p] = { url: f.url, fileId: f.id, updatedAt: f.updatedAt };
      }
    }
    nextToken = meta?.nextToken;
  } while (nextToken);
  return updates;
};
initAssets(globalObj, assetsMetadata, localHashes, { refresher });
}

// Auto-initialize if running in a supported environment
if (typeof globalThis !== 'undefined') {
  initializeAssets(globalThis);
} else if (typeof global !== 'undefined') {
  initializeAssets(global);
}
