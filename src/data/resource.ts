import type { WorkerResponse } from '../types/workerTypes';

export type RawData = Record<string, unknown>;

let dataPromise: Promise<RawData> | null = null;
let dataCache: RawData | null = null;

export function createDataResource(url: string) {
  return {
    read(): RawData {
      if (dataCache) {
        return dataCache;
      }

      if (!dataPromise) {
        dataPromise = new Promise<RawData>((resolve, reject) => {
          const worker = new Worker(new URL('../worker/dataWorker.ts', import.meta.url), { type: 'module' });

          worker.postMessage({ url });

          worker.onmessage = (ev: MessageEvent<WorkerResponse<RawData>>) => {
            const { ok, data, error } = ev.data;

            if (ok && data) {
              dataCache = data;
              resolve(data);
            } else {
              reject(new Error(error ?? 'Unknown worker error'));
            }

            worker.terminate();
          };

          worker.onerror = (err) => {
            reject(new Error(err.message));
            worker.terminate();
          };
        });
      }
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw dataPromise;
    },
  };
}
