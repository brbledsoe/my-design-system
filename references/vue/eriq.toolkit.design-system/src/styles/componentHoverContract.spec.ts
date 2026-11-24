import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const componentCss = readFileSync(resolve(process.cwd(), 'src/styles/component.scss'), 'utf8');

function ruleBody(selector: string): string | undefined {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return componentCss.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))?.[1];
}

describe('subtle component hover contract', () => {
  it('uses a quieter palette step for an open popover than for hover', () => {
    expect(ruleBody('.eq-component--color-neutral')).toContain(
      '--eq-component-tone-open: var(--eq-neutral-2)',
    );
    expect(ruleBody('.eq-component--color-neutral')).toContain(
      '--eq-component-tone-soft: var(--eq-neutral-3)',
    );
    expect(componentCss).toContain('--eq-component-tone-open: var(--eq-brand-2)');
    expect(componentCss).toContain('--eq-component-tone-soft: var(--eq-brand-3)');
    expect(componentCss).toContain('--eq-component-tone-open: var(--eq-#{$scale}-2)');
    expect(componentCss).toContain('--eq-component-tone-soft: var(--eq-#{$scale}-3)');
  });

  it('maps aria-expanded to the open surface before hover can deepen it', () => {
    const openSelector =
      ".eq-component[aria-expanded='true']:not(:disabled, [aria-disabled='true'])";
    const hoverSelector =
      '.eq-component:is(.eq-component--hover-default, .eq-component--hover-ghost):hover:not(';

    expect(ruleBody(openSelector)).toContain('--eq-component-open-surface');
    expect(componentCss.indexOf(openSelector)).toBeLessThan(componentCss.indexOf(hoverSelector));
    expect(componentCss).not.toContain(
      ".eq-component--hover-ghost:is(:focus-visible, [aria-expanded='true'])",
    );
  });

  it('uses the open tone for transparent appearances and preserves filled state surfaces', () => {
    expect(ruleBody('.eq-component--appearance-outlined')).toContain(
      '--eq-component-open-surface: var(--eq-component-tone-open)',
    );
    expect(ruleBody('.eq-component--appearance-plain')).toContain(
      '--eq-component-open-surface: var(--eq-component-tone-open)',
    );
    expect(ruleBody('.eq-component--appearance-filled')).toContain(
      '--eq-component-open-surface: var(--eq-component-filled-surface)',
    );
  });

  it('uses the base soft surface for outlined and ghost hovers', () => {
    expect(ruleBody('.eq-component--appearance-outlined')).toContain(
      '--eq-component-surface-hover: var(--eq-component-tone-soft)',
    );
    expect(ruleBody('.eq-component--hover-ghost:not(.eq-component--appearance-plain)')).toContain(
      '--eq-component-surface-hover: var(--eq-component-tone-soft)',
    );
  });

  it('keeps outlined borders neutral at rest and restores emphasis during interaction', () => {
    const outlined = ruleBody('.eq-component--appearance-outlined');

    expect(outlined).toContain(
      '--eq-component-rest-border: var(--eq-component-outlined-rest-border, var(--eq-neutral-5))',
    );
    expect(outlined).toContain(
      '--eq-component-open-border: var(--eq-component-appearance-border)',
    );
    expect(outlined).toContain(
      '--eq-component-border-hover: var(--eq-component-appearance-border-hover)',
    );
    expect(outlined).toContain(
      '--eq-component-selected-border: var(--eq-component-appearance-border-hover)',
    );
  });

  it('keeps ordinary filled hovers on the next soft step', () => {
    expect(ruleBody('.eq-component--appearance-filled')).toContain(
      '--eq-component-surface-hover: var(--eq-component-filled-surface-hover)',
    );
  });
});
