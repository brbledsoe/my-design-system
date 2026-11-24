import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const componentCss = readFileSync(resolve(process.cwd(), 'src/styles/component.scss'), 'utf8');
const roleCss = readFileSync(resolve(process.cwd(), 'src/tokens/color.role.tokens.css'), 'utf8');
const typographyCss = readFileSync(resolve(process.cwd(), 'src/tokens/typography.tokens.css'), 'utf8');
const dimensionCss = readFileSync(
  resolve(process.cwd(), 'src/tokens/dimension.primitive.tokens.css'),
  'utf8',
);
const publicTypes = readFileSync(resolve(process.cwd(), 'src/types.ts'), 'utf8');

describe('component styling contract', () => {
  it('exposes stable state variables and the canonical component API', () => {
    expect(publicTypes).toContain('export interface EqComponent {');
    expect(publicTypes).not.toContain('EqComponentProps');

    for (const variable of [
      '--eq-component-surface',
      '--eq-component-surface-hover',
      '--eq-component-surface-active',
      '--eq-component-border-color',
      '--eq-component-line-style',
      '--eq-component-ink',
      '--eq-component-filled-ink',
      '--eq-component-focus-ring',
    ]) {
      expect(componentCss).toContain(variable);
    }

    for (const emphasis of ['primary', 'secondary', 'tertiary']) {
      expect(componentCss).toContain(`.eq-component--emphasis-${emphasis}`);
      expect(publicTypes).toContain(`'${emphasis}'`);
    }

    for (const appearance of ['filled', 'outlined', 'plain']) {
      expect(componentCss).toContain(`.eq-component--appearance-${appearance}`);
      expect(publicTypes).toContain(`'${appearance}'`);
    }

    for (const hover of ['default', 'none', 'ghost']) {
      expect(componentCss).toContain(`.eq-component--hover-${hover}`);
    }
    expect(publicTypes).toContain("export type EqHover = boolean | 'ghost'");

    for (const lineStyle of ['solid', 'dashed']) {
      expect(componentCss).toContain(`.eq-component--line-${lineStyle}`);
      expect(publicTypes).toContain(`'${lineStyle}'`);
    }
  });

  it('uses the brand focus ring for neutral controls and neutral alpha roles for disabled state', () => {
    expect(componentCss).toContain('.eq-component:focus-visible');
    const neutralBlock = componentCss.match(/\.eq-component--color-neutral\s*\{([^}]*)\}/)?.[1];
    expect(neutralBlock).toContain('--eq-component-focus-ring: var(--eq-focus-ring-accent)');
    expect(componentCss).toMatch(/\.eq-component:is\(:disabled, \[aria-disabled=['"]true['"]\]\)/);
    expect(componentCss).toContain('var(--eq-surface-disabled)');
    expect(componentCss).toContain('var(--eq-border-disabled)');
    expect(componentCss).toContain('var(--eq-ink-disabled)');
    expect(roleCss).toContain('--eq-surface-disabled: var(--eq-neutral-a3)');
    expect(roleCss).toContain('--eq-border-disabled: var(--eq-neutral-a6)');
    expect(roleCss).toContain('--eq-ink-disabled: var(--eq-neutral-a8)');
  });

  it('provides a subtle neutral-alpha role for large row hover surfaces', () => {
    expect(roleCss).toContain('--eq-surface-row-hover: var(--eq-neutral-a3)');
  });

  it('uses the lighter neutral-alpha step for placeholder ink', () => {
    expect(roleCss).toContain('--eq-ink-placeholder: var(--eq-neutral-a9)');
  });

  it('defines every canonical component height and font-size pairing', () => {
    const sizes = {
      xxxs: { height: 16, fontSize: 'xxxs' },
      xxs: { height: 18, fontSize: 'xxs' },
      xs: { height: 20, fontSize: 'xs' },
      sm: { height: 26, fontSize: 'sm' },
      md: { height: 28, fontSize: 'md' },
      lg: { height: 32, fontSize: 'lg' },
      xl: { height: 36, fontSize: 'xl' },
      xxl: { height: 40, fontSize: 'xl' },
      xxxl: { height: 44, fontSize: 'xxl' },
      xxxxl: { height: 48, fontSize: 'xxxl' },
    } as const;

    for (const [size, { height, fontSize }] of Object.entries(sizes)) {
      const block = componentCss.match(new RegExp(`\\.eq-component--${size}\\s*\\{([^}]*)\\}`))?.[1];

      expect(block).toContain(`--eq-component-height: var(--eq-size-${height})`);
      expect(block).toContain(`--eq-component-font-size: var(--eq-font-size-${fontSize})`);
      expect(publicTypes).toContain(`| '${size}'`);
    }

    expect(dimensionCss).toContain('--eq-size-36: calc(var(--eq-unit) * 9)');
  });

  it('defines the complete canonical typography scale and body roles', () => {
    const sizes = {
      xxxs: 9,
      xxs: 10,
      xs: 11,
      sm: 13,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
    } as const;

    for (const [size, pixels] of Object.entries(sizes)) {
      expect(typographyCss).toContain(`--eq-font-size-${size}: var(--eq-symbol-${pixels})`);
      expect(publicTypes).toContain(`| '${size}'`);
    }

    expect(typographyCss).toContain('--eq-body-sm-size: var(--eq-font-size-sm)');
    expect(typographyCss).toContain('--eq-body-md-size: var(--eq-font-size-md)');
    expect(typographyCss).toContain('--eq-body-lg-size: var(--eq-font-size-lg)');
  });

  it('keeps ghost behavior independent from filled and outlined appearances', () => {
    const ghostBlock = componentCss.match(/\.eq-component--hover-ghost\s*\{([^}]*)\}/)?.[1];

    expect(ghostBlock).toContain('--eq-component-surface: transparent');
    expect(ghostBlock).toContain('--eq-component-border-color: transparent');
    expect(componentCss).toContain('.eq-component--appearance-filled');
    expect(componentCss).toContain('.eq-component--appearance-outlined');
  });
});
