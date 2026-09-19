import test from 'node:test';
import assert from 'node:assert/strict';
import { safeReturn } from '../assets/auth-common.js';
test('login return paths stay on this site and cannot loop through authentication routes', () => {
  const origin = 'https://chorecharteasy.com';
  for (const value of ['https://evil.example', '//evil.example', '/\\evil.example', '/login', '/login.html?next=/login', '/api/auth/google', null]) {
    assert.equal(safeReturn(value, origin), '/#chart-maker');
  }
  assert.equal(safeReturn('/?template=weekly#chart-maker', origin), '/?template=weekly#chart-maker');
  assert.equal(safeReturn('/account', origin), '/account');
});
