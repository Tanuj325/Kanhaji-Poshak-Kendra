/**
 * Helper to wrap dynamic component imports with automatic recovery for stale production chunks.
 * If a chunk fails to load due to a new Vercel deployment, it performs a single page reload
 * to fetch the latest index.html and chunk mappings, avoiding infinite reload loops.
 *
 * @param {Function} importFn - Dynamic import function, e.g., () => import('@/pages/public/HomePage')
 * @returns {Promise<any>}
 */
export function retryImport(importFn) {
  return new Promise((resolve, reject) => {
    importFn()
      .then(resolve)
      .catch((error) => {
        const errorMessage = error?.message || String(error || '');
        const isChunkError =
          error?.name === 'ChunkLoadError' ||
          /Failed to fetch dynamically imported module/i.test(errorMessage) ||
          /Importing a module script failed/i.test(errorMessage) ||
          /Expected a JavaScript-or-Wasm module script/i.test(errorMessage) ||
          /text\/html/i.test(errorMessage);

        const RELOAD_KEY = 'kp_chunk_reload_attempted';
        const hasReloaded = sessionStorage.getItem(RELOAD_KEY);

        if (isChunkError && !hasReloaded) {
          sessionStorage.setItem(RELOAD_KEY, 'true');
          window.location.reload();
          return;
        }

        sessionStorage.removeItem(RELOAD_KEY);
        reject(error);
      });
  });
}

export default retryImport;
