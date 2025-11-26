import { teardownTestApp } from './test-setup';

export default async function globalTeardown() {
  await teardownTestApp();
}
