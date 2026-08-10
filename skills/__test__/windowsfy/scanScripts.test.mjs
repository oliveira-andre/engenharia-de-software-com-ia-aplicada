import { describe, it, strict } from 'poku';
import { scanScripts } from '../../windowsfy/scripts/scan.mjs';

describe('scanScripts', () => {
  it('inline-env script produces inline-env finding', () => {
    const findings = scanScripts({
      scripts: { start: 'NODE_ENV=test node x.js' },
    });
    const f = findings.find((x) => x.category === 'inline-env');

    strict.ok(f);
    strict.equal(f.script, 'start');
  });

  it('rm -rf script produces unix-cmd finding', () => {
    const findings = scanScripts({ scripts: { clean: 'rm -rf storage' } });
    const f = findings.find((x) => x.category === 'unix-cmd');

    strict.ok(f);
    strict.equal(f.script, 'clean');
  });

  it('single-quote in args produces single-quote finding', () => {
    const findings = scanScripts({ scripts: { msg: "node --msg 'hello'" } });
    const f = findings.find((x) => x.category === 'single-quote');

    strict.ok(f);
    strict.equal(f.script, 'msg');
  });

  it('glob pattern produces glob-expand finding', () => {
    const findings = scanScripts({
      scripts: { test: 'node --test tests/**/*.test.ts' },
    });
    const f = findings.find((x) => x.category === 'glob-expand');

    strict.ok(f);
    strict.equal(f.script, 'test');
  });

  it('&& produces ps5-ampamp finding', () => {
    const findings = scanScripts({ scripts: { both: 'echo A && echo B' } });
    const f = findings.find((x) => x.category === 'ps5-ampamp');

    strict.ok(f);
    strict.equal(f.script, 'both');
  });

  it('cross-env-prefixed script does not produce inline-env finding', () => {
    const findings = scanScripts({
      scripts: { start: 'cross-env NODE_ENV=test node x.js' },
    });

    strict.equal(
      findings.find((x) => x.category === 'inline-env'),
      undefined
    );
  });

  it('shx-prefixed rm -rf does not produce unix-cmd finding', () => {
    const findings = scanScripts({ scripts: { clean: 'shx rm -rf storage' } });

    strict.equal(
      findings.find((x) => x.category === 'unix-cmd'),
      undefined
    );
  });

  it('glob -c wrapper does not produce glob-expand finding', () => {
    const findings = scanScripts({
      scripts: { test: 'glob -c "node --test" "tests/**/*.test.ts"' },
    });

    strict.equal(
      findings.find((x) => x.category === 'glob-expand'),
      undefined
    );
  });
});
