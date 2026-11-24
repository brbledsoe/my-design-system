export interface EqComponent {
  appearance?: EqAppearance;
  color?: EqColor;
  size?: EqSize;
  hover?: EqHover;
  selected?: boolean;
  lineStyle?: EqLineStyle;
  emphasis?: EqEmphasis;
  radius?: EqRadius;
  shadow?: EqShadow;
  padding?: EqPadding;
  width?: EqWidth;
}

export interface EqGroup extends EqComponent {
  direction?: EqLayout;
  gap?: EqSpace;
  overflow?: EqOverflow;
}

export type EqEmphasis = 'primary' | 'secondary' | 'tertiary';

export type EqAppearance = 'filled' | 'outlined' | 'plain';

export type EqHover = boolean | 'ghost';

export type EqLineStyle = 'solid' | 'dashed';

export type EqColor =
  | 'neutral'
  | 'brand'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'indigo'
  | 'orange'
  | 'mauve'
  | 'sage'
  | 'olive'
  | 'sand'
  | 'gold'
  | 'bronze'
  | 'brown'
  | 'mint'
  | 'jade'
  | 'sky'
  | 'iris'
  | 'violet'
  | 'plum'
  | 'pink';

export type EqSize = 'xxxs' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl';

export type EqPadding = 'compact' | 'standard' | 'spacious';

export type EqRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'round';

export type EqShadow = 'none' | '1' | '2' | '3' | '4' | '5' | '6';

export type EqWidth = 'auto' | 'content' | 'stretch' | number | string;

// Layout
export type EqLayout = 'horizontal' | 'vertical' | 'layered';

export type EqOverflow = 'visible' | 'wrap' | 'scroll' | 'clip';

export type EqSpace =
  | '0'
  | '2'
  | '4'
  | '6'
  | '8'
  | '10'
  | '12'
  | '16'
  | '20'
  | '24'
  | '28'
  | '32'
  | '36'
  | '40'
  | '48'
  | '64'
  | '80'
  | '96';

// Application
export type EqDensity = 'tight' | 'compact' | 'default' | 'relaxed' | 'spacious';

// Typography
export type EqFontFamily = 'sans' | 'mono';

export type EqFontSize =
  | 'xxxs'
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'
  | 'display-sm'
  | 'display-md'
  | 'display-lg'
  | 'display-xl';

export type EqFontWeight = 'light' | 'regular' | 'medium' | 'bold';

export type EqLineHeight = 'none' | 'tight' | 'compact' | 'normal' | 'relaxed';

export type EqLetterSpacing = 'tight' | 'normal' | 'wide';

export type EqBodySize = 'sm' | 'md' | 'lg';
