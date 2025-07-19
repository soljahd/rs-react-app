import { describe, it, expect } from 'vitest';

describe('main.tsx', () => {
  it('throws if #root is not found', async () => {
    await expect(import('../main.tsx')).rejects.toThrow('#root not found in DOM');
  });
});
