import { describe, it, strict } from 'poku';
import { tokenPrecedes } from '../../windowsfy/scripts/scan.mjs';

describe('tokenPrecedes', () => {
  it('returns true when token appears before the match index', () => {
    const value = 'cross-env NODE_ENV=test node x.js';
    const idx = value.indexOf('NODE_ENV');

    strict.equal(tokenPrecedes(value, 'cross-env', idx), true);
  });
});
