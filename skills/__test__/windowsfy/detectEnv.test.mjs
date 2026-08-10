import { describe, it, strict } from 'poku';
import { detectEnv } from '../../windowsfy/scripts/scan.mjs';

const KNOWN_ENVS = [
  'windows-native',
  'wsl',
  'git-bash',
  'cygwin',
  'linux',
  'darwin',
  'unknown',
];

await describe('detectEnv', async () => {
  await it('returns a known platform identifier', async () => {
    strict.ok(KNOWN_ENVS.includes(await detectEnv()));
  });
});
