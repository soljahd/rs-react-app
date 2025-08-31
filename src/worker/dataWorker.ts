import type { WorkerRequest, WorkerResponse } from '../types/workerTypes';

self.addEventListener('message', (ev: MessageEvent<WorkerRequest>) => {
  const { url } = ev.data;

  void (async () => {
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`Failed to fetch data: ${resp.status.toString()}`);
      }

      const text = await resp.text();
      const parsed: unknown = JSON.parse(text);

      const message: WorkerResponse = {
        ok: true,
        data: parsed,
      };

      self.postMessage(message);
    } catch (error) {
      const message: WorkerResponse = {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };

      self.postMessage(message);
    }
  })();
});

export {};
