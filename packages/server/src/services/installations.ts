import { redis } from './queue';

const keyFor = (username: string) => `github:installation:${username.toLowerCase()}`;

export async function setInstallationId(username: string, installationId: number): Promise<void> {
  await redis.set(keyFor(username), String(installationId));
}

export async function getInstallationId(username: string): Promise<number | null> {
  const val = await redis.get(keyFor(username));
  if (!val) return null;
  const parsed = Number(val);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function deleteInstallationId(username: string): Promise<void> {
  await redis.del(keyFor(username));
}


