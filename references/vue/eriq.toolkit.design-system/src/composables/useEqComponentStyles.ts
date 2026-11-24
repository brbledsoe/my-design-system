import { computed, type CSSProperties } from 'vue';
import type { EqComponent, EqHover, EqShadow, EqWidth } from '../types';

function hoverClass(hover: EqHover | undefined): string {
  if (hover === false) return 'none';
  if (hover === 'ghost') return 'ghost';
  return 'default';
}

export function resolveEqWidth(width: EqWidth | undefined): CSSProperties['width'] {
  if (typeof width === 'number') return `${width}px`;
  if (width === 'stretch') return '100%';
  if (width === 'content' || width === 'auto' || width === undefined) return 'auto';
  return width;
}

export function resolveEqShadow(shadow: EqShadow | undefined): CSSProperties['boxShadow'] {
  if (shadow === undefined) return undefined;
  if (shadow === 'none') return 'none';
  return `var(--eq-shadow-${shadow})`;
}

export function useEqComponentStyles(props: Readonly<EqComponent>) {
  const rootClasses = computed(() => [
    'eq-component',
    `eq-component--${props.size ?? 'md'}`,
    `eq-component--emphasis-${props.emphasis ?? 'tertiary'}`,
    `eq-component--appearance-${props.appearance ?? 'filled'}`,
    `eq-component--hover-${hoverClass(props.hover)}`,
    `eq-component--line-${props.lineStyle ?? 'solid'}`,
    ...(props.selected ? ['eq-component--selected'] : []),
    `eq-component--color-${props.color ?? 'neutral'}`,
    `eq-component--radius-${props.radius ?? 'md'}`,
    `eq-component--padding-${props.padding ?? 'standard'}`,
  ]);

  const rootStyle = computed<CSSProperties>(() => ({
    width: resolveEqWidth(props.width),
    boxShadow: resolveEqShadow(props.shadow),
  }));

  return {
    rootClasses,
    rootStyle,
  };
}
