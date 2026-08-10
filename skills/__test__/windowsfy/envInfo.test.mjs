import { describe, it, strict } from 'poku';
import { envInfo } from '../../windowsfy/scripts/scan.mjs';

const KNOWN_ENVS = [
  'windows-native',
  'wsl',
  'git-bash',
  'cygwin',
  'linux',
  'darwin',
  'unknown',
];

await describe('envInfo', async () => {
  await it('returns shape { env, allowed, reason }', async () => {
    const info = await envInfo();

    strict.ok(KNOWN_ENVS.includes(info.env));
    strict.equal(info.allowed, info.env === 'windows-native');
    strict.equal(typeof info.reason, 'string');
    strict.ok(info.reason.length > 0);
  });
});
