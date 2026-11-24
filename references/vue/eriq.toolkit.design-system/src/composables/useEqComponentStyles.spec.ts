import { describe, expect, it } from 'vitest';
import { nextTick, reactive } from 'vue';
import type { EqComponent } from '../types';
import { resolveEqShadow, resolveEqWidth, useEqComponentStyles } from './useEqComponentStyles';

describe('useEqComponentStyles', () => {
  it('applies the design-system defaults', () => {
    const { rootClasses, rootStyle } = useEqComponentStyles({});

    expect(rootClasses.value).toEqual([
      'eq-component',
      'eq-component--md',
      'eq-component--emphasis-tertiary',
      'eq-component--appearance-filled',
      'eq-component--hover-default',
      'eq-component--line-solid',
      'eq-component--color-neutral',
      'eq-component--radius-md',
      'eq-component--padding-standard',
    ]);
    expect(rootStyle.value.width).toBe('auto');
    expect(rootStyle.value.boxShadow).toBeUndefined();
  });

  it('reacts to canonical component props', async () => {
    const props = reactive<EqComponent>({
      size: 'sm',
      emphasis: 'primary',
      appearance: 'outlined',
      hover: false,
      selected: true,
      lineStyle: 'dashed',
      color: 'success',
      radius: 'round',
      shadow: '5',
      padding: 'compact',
      width: 'stretch',
    });
    const { rootClasses, rootStyle } = useEqComponentStyles(props);

    expect(rootClasses.value).toContain('eq-component--color-success');
    expect(rootClasses.value).toContain('eq-component--emphasis-primary');
    expect(rootClasses.value).toContain('eq-component--appearance-outlined');
    expect(rootClasses.value).toContain('eq-component--hover-none');
    expect(rootClasses.value).toContain('eq-component--selected');
    expect(rootClasses.value).toContain('eq-component--line-dashed');
    expect(rootStyle.value.boxShadow).toBe('var(--eq-shadow-5)');
    expect(rootStyle.value.width).toBe('100%');

    props.width = 'content';
    props.shadow = 'none';
    await nextTick();
    expect(rootStyle.value.width).toBe('auto');
    expect(rootStyle.value.boxShadow).toBe('none');
  });

  it.each([
    [true, 'default'],
    [false, 'none'],
    ['ghost', 'ghost'],
  ] as const)('maps hover %s to the %s interaction class', (hover, expected) => {
    const { rootClasses } = useEqComponentStyles({ hover });

    expect(rootClasses.value).toContain(`eq-component--hover-${expected}`);
  });
});

describe('resolveEqShadow', () => {
  it.each([
    [undefined, undefined],
    ['none', 'none'],
    ['1', 'var(--eq-shadow-1)'],
    ['2', 'var(--eq-shadow-2)'],
    ['3', 'var(--eq-shadow-3)'],
    ['4', 'var(--eq-shadow-4)'],
    ['5', 'var(--eq-shadow-5)'],
    ['6', 'var(--eq-shadow-6)'],
  ] as const)('maps %s to %s', (input, expected) => {
    expect(resolveEqShadow(input)).toBe(expected);
  });
});

describe('resolveEqWidth', () => {
  it.each([
    [undefined, 'auto'],
    ['auto', 'auto'],
    ['content', 'auto'],
    ['stretch', '100%'],
    [240, '240px'],
    ['12rem', '12rem'],
  ] as const)('maps %s to %s', (input, expected) => {
    expect(resolveEqWidth(input)).toBe(expected);
  });
});
