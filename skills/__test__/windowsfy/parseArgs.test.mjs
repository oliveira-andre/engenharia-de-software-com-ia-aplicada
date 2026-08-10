import { describe, it, strict } from 'poku';
import { parseArgs } from '../../windowsfy/scripts/scan.mjs';

describe('parseArgs', () => {
  it('empty argv returns defaults', () => {
    strict.deepEqual(parseArgs([]), {
      json: false,
      checkEnv: false,
      root: null,
      file: null,
      shell: 'cmd',
    });
  });

  it('--check-env sets checkEnv', () => {
    strict.equal(parseArgs(['--check-env']).checkEnv, true);
  });

  it('--root <dir> sets root', () => {
    strict.equal(parseArgs(['--root', '/tmp']).root, '/tmp');
  });

  it('--file <path> sets file', () => {
    strict.equal(
      parseArgs(['--file', '/tmp/package.json']).file,
      '/tmp/package.json'
    );
  });

  it('--shell ps7 sets shell', () => {
    strict.equal(parseArgs(['--shell', 'ps7']).shell, 'ps7');
  });

  it('--json sets json', () => {
    strict.equal(parseArgs(['--json']).json, true);
  });

  it('-h sets help', () => {
    strict.equal(parseArgs(['-h']).help, true);
  });

  it('--help sets help', () => {
    strict.equal(parseArgs(['--help']).help, true);
  });

  it('combined flags', () => {
    const args = parseArgs(['--root', '/tmp', '--shell', 'ps5', '--json']);

    strict.equal(args.root, '/tmp');
    strict.equal(args.shell, 'ps5');
    strict.equal(args.json, true);
  });
});
