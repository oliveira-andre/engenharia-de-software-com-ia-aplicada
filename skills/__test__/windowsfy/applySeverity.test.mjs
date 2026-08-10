import { describe, it, strict } from 'poku';
import { applySeverity } from '../../windowsfy/scripts/scan.mjs';

describe('applySeverity', () => {
  const base = [
    { category: 'native-dep', severity: 'info', snippet: 'x' },
    { category: 'inline-env', severity: 'error', snippet: 'y' },
    { category: 'ps5-ampamp', severity: 'info', snippet: '&&' },
  ];

  it('shell=cmd filters ps5-ampamp; keeps others with mapped severity', () => {
    const out = applySeverity(base, 'cmd');

    strict.equal(out.length, 2);
    strict.equal(
      out.find((f) => f.category === 'ps5-ampamp'),
      undefined
    );
    strict.equal(
      out.find((f) => f.category === 'inline-env').severity,
      'error'
    );
    strict.equal(out.find((f) => f.category === 'native-dep').severity, 'info');
  });

  it('shell=ps5 keeps ps5-ampamp as info', () => {
    const out = applySeverity(base, 'ps5');
    const f = out.find((x) => x.category === 'ps5-ampamp');

    strict.ok(f);
    strict.equal(f.severity, 'info');
  });

  it('shell=ps7 filters ps5-ampamp', () => {
    const out = applySeverity(base, 'ps7');

    strict.equal(
      out.find((f) => f.category === 'ps5-ampamp'),
      undefined
    );
  });
});
