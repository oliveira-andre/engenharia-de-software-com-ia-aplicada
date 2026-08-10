import { describe, it, beforeEach, afterEach, strict } from 'poku';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  walk,
  loadPackageJson,
  scanPackageJson,
} from '../../windowsfy/scripts/scan.mjs';

await describe('walk + loadPackageJson + scanPackageJson (with tmp fixtures)', async () => {
  let tmpDir;
  let pkgA;
  let pkgB;

  const before = beforeEach(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'windowsfy-test-'));
    pkgA = join(tmpDir, 'a', 'package.json');
    pkgB = join(tmpDir, 'b', 'nested', 'package.json');

    const pkgC = join(tmpDir, 'node_modules', 'c', 'package.json');
    const pkgD = join(tmpDir, 'dist', 'd', 'package.json');

    await mkdir(join(tmpDir, 'a'), { recursive: true });
    await mkdir(join(tmpDir, 'b', 'nested'), { recursive: true });
    await mkdir(join(tmpDir, 'node_modules', 'c'), { recursive: true });
    await mkdir(join(tmpDir, 'dist', 'd'), { recursive: true });
    await writeFile(
      pkgA,
      JSON.stringify(
        {
          name: 'a',
          dependencies: { '@tensorflow/tfjs-node': '^4.22.0' },
          scripts: { start: 'NODE_ENV=test node a.js' },
        },
        null,
        2
      )
    );
    await writeFile(
      pkgB,
      JSON.stringify({ name: 'b', scripts: Object.create(null) }, null, 2)
    );
    await writeFile(pkgC, JSON.stringify({ name: 'c-in-nm' }, null, 2));
    await writeFile(pkgD, JSON.stringify({ name: 'd-in-dist' }, null, 2));
  });

  const after = afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  await it('walk returns package.json files and skips node_modules + dist', async () => {
    const files = (await walk(tmpDir)).sort();

    strict.equal(files.length, 2);
    strict.deepEqual(files, [pkgA, pkgB].sort());
  });

  await it('loadPackageJson returns the parsed object', async () => {
    const pkg = await loadPackageJson(pkgA);

    strict.equal(pkg.name, 'a');
    strict.ok(pkg.dependencies);
    strict.ok(pkg.scripts);
  });

  await it('scanPackageJson returns native-dep findings before script findings', async () => {
    const findings = await scanPackageJson(pkgA, null);

    strict.equal(findings.length, 2);
    strict.equal(findings[0].category, 'native-dep');
    strict.equal(findings[1].category, 'inline-env');
  });

  await it('scanPackageJson sets file to basename when rootForRel is null', async () => {
    const findings = await scanPackageJson(pkgA, null);

    strict.ok(findings[0].file.endsWith('package.json'));
  });

  await it('scanPackageJson sets file to relative path when rootForRel is provided', async () => {
    const findings = await scanPackageJson(pkgA, tmpDir);

    strict.equal(findings[0].file, join('a', 'package.json'));
  });

  before.reset();
  after.reset();
});
