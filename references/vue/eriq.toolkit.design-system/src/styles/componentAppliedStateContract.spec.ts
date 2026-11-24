import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const componentCss = readFileSync(resolve(process.cwd(), 'src/styles/component.scss'), 'utf8');

describe('component applied-state contract', () => {
  it('uses the Radix soft interaction ladder for a persistent applied state', () => {
    const selector = ".eq-component[data-chip-applied-state='true']";
    const ruleStart = componentCss.indexOf(selector);
    const ruleEnd = componentCss.indexOf('\n}', ruleStart);
    const rule = componentCss.slice(ruleStart, ruleEnd);

    expect(ruleStart).toBeGreaterThanOrEqual(0);
    expect(rule).toContain('--eq-component-surface: var(--eq-component-tone-soft)');
    expect(rule).toContain('--eq-component-surface-hover: var(--eq-component-tone-soft-hover)');
    expect(rule).toContain('--eq-component-surface-active: var(--eq-component-tone-soft-active)');
    expect(rule).toContain('--eq-component-border-color: transparent');
    expect(rule).toContain('--eq-component-border-hover: transparent');
    expect(rule).toContain('--eq-component-border-active: transparent');
  });

  it('maps the brand soft interaction ladder to canonical steps 3, 4, and 5', () => {
    expect(componentCss).toContain('--eq-component-tone-soft: var(--eq-brand-3)');
    expect(componentCss).toContain('--eq-component-tone-soft-hover: var(--eq-brand-4)');
    expect(componentCss).toContain('--eq-component-tone-soft-active: var(--eq-brand-5)');
  });
});
