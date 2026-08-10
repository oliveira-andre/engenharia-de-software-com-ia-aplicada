import { describe, it, strict } from 'poku';
import { findNativeDeps } from '../../windowsfy/scripts/scan.mjs';

describe('findNativeDeps', () => {
  it('single native dep in dependencies produces one info finding', () => {
    const pkg = { dependencies: { '@tensorflow/tfjs-node': '^4.22.0' } };
    const findings = findNativeDeps(pkg);

    strict.equal(findings.length, 1);
    strict.equal(findings[0].category, 'native-dep');
    strict.equal(findings[0].severity, 'info');
    strict.equal(findings[0].snippet, '@tensorflow/tfjs-node');
  });

  it('two native deps split across dependencies and devDependencies produce two findings', () => {
    const pkg = {
      dependencies: { 'better-sqlite3': '^11.0.0' },
      devDependencies: { '@xenova/transformers': '^2.0.0' },
    };

    const findings = findNativeDeps(pkg);
    strict.equal(findings.length, 2);

    const snippets = findings.map((f) => f.snippet).sort();
    strict.deepEqual(snippets, ['@xenova/transformers', 'better-sqlite3']);
  });
});
