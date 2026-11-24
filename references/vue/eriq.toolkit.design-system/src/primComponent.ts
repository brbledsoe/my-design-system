import type { Component } from 'vue';

// ============================================================================
// RESPONSIVE
// ============================================================================

export type EqResponsive<T> =
  | T
  | Readonly<{
      mobile: T;
      tablet?: T;
      desktop?: T;
      wide?: T;
    }>;

export type ResponsiveProps<T> = {
  [K in keyof T]?: EqResponsive<T[K]>;
};

export type EqBreakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';
export type EqCollapseBreakpoint = Exclude<EqBreakpoint, 'mobile'>;

// ============================================================================
// TOKENS
// ============================================================================

export type EqSpace =
  | 'none'
  | 'xxsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'xxlarge'
  | 'xxxlarge'
  | 'gutter';

export type EqMainAxisAlignment =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly';

export type EqCrossAxisAlignment = 'start' | 'center' | 'end' | 'stretch';
export type EqInlineYAlignment = EqCrossAxisAlignment | 'baseline';

export type EqColumnCount = 1 | 2 | 3 | 4 | 5 | 6;
export type EqFraction =
  | '1/6'
  | '1/5'
  | '1/4'
  | '1/3'
  | '2/5'
  | '1/2'
  | '3/5'
  | '2/3'
  | '3/4'
  | '4/5'
  | '5/6';

export type EqColumnWidth =
  | 'content'
  | 'fluid'
  | 'narrow'
  | 'medium'
  | 'wide'
  | EqFraction;

export type EqWidth = 'auto' | 'content' | 'full' | 'touchable' | EqFraction;
export type EqHeight = 'auto' | 'content' | 'full' | 'screen' | 'touchable';
export type EqMinSize = 'none' | 'content' | 'touchable';
export type EqMaxWidth =
  | 'content'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'full';
export type EqMaxHeight = 'content' | 'full' | 'screen';

export type EqDisplay =
  | 'none'
  | 'block'
  | 'inline'
  | 'inlineBlock'
  | 'flex'
  | 'grid';

export type EqOverflow = 'visible' | 'hidden' | 'clip' | 'auto' | 'scroll';
export type EqPosition = 'relative' | 'absolute' | 'fixed' | 'sticky';
export type EqInset = 0 | 'auto' | EqSpace;
export type EqTextAlignment = 'start' | 'center' | 'end';

export type EqBackground =
  | 'transparent'
  | 'body'
  | 'surface'
  | 'surfaceRaised'
  | 'neutral'
  | 'brand'
  | 'positive'
  | 'caution'
  | 'critical'
  | 'info'
  | 'customLight'
  | 'customDark';

export type EqBorder =
  | 'none'
  | 'subtle'
  | 'neutral'
  | 'strong'
  | 'field'
  | 'brand'
  | 'positive'
  | 'caution'
  | 'critical'
  | 'info';

export type EqRadius = 'none' | 'small' | 'standard' | 'large' | 'xlarge' | 'full';
export type EqShadow = 'none' | 'small' | 'medium' | 'large' | 'overlay';
export type EqZIndex =
  | 'base'
  | 'raised'
  | 'sticky'
  | 'dropdownBackdrop'
  | 'dropdown'
  | 'modalBackdrop'
  | 'modal'
  | 'notification';

export type EqLayoutElement = keyof HTMLElementTagNameMap | Component;
export type EqDataAttributeValue = string | number | boolean | null | undefined;
export type EqDataAttributes = Readonly<Record<string, EqDataAttributeValue>>;

// ============================================================================
// SHARED BASE
// ============================================================================

export type DesignSystemProps = {
  as?: EqLayoutElement;
  asChild?: boolean;
  data?: EqDataAttributes;
  hideBelow?: EqCollapseBreakpoint;
  hideAbove?: EqBreakpoint;
  hideOnPrint?: boolean;
} & ResponsiveProps<{
  visible: boolean;
  width: EqWidth;
  minWidth: EqMinSize;
  maxWidth: EqMaxWidth;
  height: EqHeight;
  minHeight: EqMinSize;
  maxHeight: EqMaxHeight;
  padding: EqSpace;
  paddingX: EqSpace;
  paddingY: EqSpace;
  paddingTop: EqSpace;
  paddingRight: EqSpace;
  paddingBottom: EqSpace;
  paddingLeft: EqSpace;
  bleed: EqSpace;
  bleedX: EqSpace;
  bleedY: EqSpace;
  bleedTop: EqSpace;
  bleedRight: EqSpace;
  bleedBottom: EqSpace;
  bleedLeft: EqSpace;
}>;

// ============================================================================
// PRIMITIVES
// ============================================================================

export type EqBox = DesignSystemProps &
  ResponsiveProps<{
    display: EqDisplay;
    centerX: boolean;
    overflow: EqOverflow;
    position: EqPosition;
    inset: EqInset;
    insetX: EqInset;
    insetY: EqInset;
    top: EqInset;
    right: EqInset;
    bottom: EqInset;
    left: EqInset;
    background: EqBackground;
    border: EqBorder;
    radius: EqRadius;
    shadow: EqShadow;
    zIndex: EqZIndex;
    textAlign: EqTextAlignment;
  }>;

export type EqStack = DesignSystemProps &
  ResponsiveProps<{
    gap: EqSpace;
    alignX: EqCrossAxisAlignment;
    alignY: EqMainAxisAlignment;
    spread: boolean;
  }>;

export type EqInline = DesignSystemProps & {
  collapseBelow?: EqCollapseBreakpoint;
  reverse?: boolean;
} & ResponsiveProps<{
    gap: EqSpace;
    alignX: EqMainAxisAlignment;
    alignY: EqInlineYAlignment;
    wrap: boolean;
    spread: boolean;
  }>;

export type EqColumns = DesignSystemProps & {
  collapseBelow?: EqCollapseBreakpoint;
  reverse?: boolean;
} & ResponsiveProps<{
    gap: EqSpace;
    alignX: EqMainAxisAlignment;
    alignY: EqCrossAxisAlignment;
    count: EqColumnCount;
  }>;

export type EqColumn = Omit<DesignSystemProps, 'width'> &
  ResponsiveProps<{
    width: EqColumnWidth;
    alignSelfY: EqCrossAxisAlignment;
  }>;
