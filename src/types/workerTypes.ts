export type WorkerRequest = {
  url: string;
};

export type WorkerResponse<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: string;
};
