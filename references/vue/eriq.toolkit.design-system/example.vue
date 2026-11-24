<template>
  <div class="eq-design-example">
    <header class="eq-design-example__header">
      <div>
        <p class="eq-design-example__eyebrow">ERIQ Design System</p>
        <h1>Component recipes and tokens</h1>
      </div>
      <p>
        A live reference for component color, emphasis, appearance, interaction, size, shape,
        spacing, and typography.
      </p>
    </header>

    <section class="eq-design-example__section">
      <div class="eq-design-example__section-heading">
        <h2>Emphasis</h2>
        <p>
          Primary is strong, secondary is muted, and tertiary is soft. Appearance remains an
          independent choice.
        </p>
      </div>

      <div class="eq-design-example__row">
        <EqComponent
          v-for="emphasis in emphases"
          :key="emphasis"
          :emphasis="emphasis"
          appearance="filled"
          color="neutral"
          size="sm"
          radius="round"
        >
          {{ emphasis }}
        </EqComponent>
      </div>
    </section>

    <section class="eq-design-example__section">
      <div class="eq-design-example__section-heading">
        <h2>Colors and appearances</h2>
        <p>Every color is shown at secondary emphasis across the three appearances.</p>
      </div>

      <div class="eq-design-example__matrix">
        <strong class="eq-design-example__matrix-heading">Color</strong>
        <strong
          v-for="appearance in appearances"
          :key="appearance"
          class="eq-design-example__matrix-heading"
        >
          {{ appearance }}
        </strong>

        <template v-for="color in colors" :key="color">
          <code class="eq-design-example__matrix-label">{{ color }}</code>
          <EqComponent
            v-for="appearance in appearances"
            :key="`${color}-${appearance}`"
            :color="color"
            emphasis="secondary"
            :appearance="appearance"
            size="sm"
            radius="round"
            padding="compact"
          >
            Aa
          </EqComponent>
        </template>
      </div>
    </section>

    <section class="eq-design-example__section">
      <div class="eq-design-example__section-heading">
        <h2>Hover behavior</h2>
        <p>Hover can be normal, disabled, or ghosted independently from appearance.</p>
      </div>

      <div class="eq-design-example__row">
        <EqComponent
          v-for="recipe in hoverRecipes"
          :key="recipe.label"
          emphasis="secondary"
          :appearance="recipe.appearance"
          :hover="recipe.hover"
          color="neutral"
          size="sm"
          radius="round"
        >
          {{ recipe.label }}
        </EqComponent>
      </div>
    </section>

    <section class="eq-design-example__section">
      <div class="eq-design-example__section-heading">
        <h2>Sizes</h2>
        <p>The complete EqComponent size scale.</p>
      </div>

      <div class="eq-design-example__row eq-design-example__row--end">
        <EqComponent
          v-for="size in sizes"
          :key="size"
          :size="size"
          color="accent"
          emphasis="tertiary"
          appearance="filled"
          radius="round"
        >
          {{ size }}
        </EqComponent>
      </div>
    </section>

    <section class="eq-design-example__section">
      <div class="eq-design-example__section-heading">
        <h2>Radius and padding</h2>
        <p>Shape and internal spacing remain constrained to the shared design-system options.</p>
      </div>

      <div class="eq-design-example__subsection">
        <h3>Radius</h3>
        <div class="eq-design-example__row">
          <EqComponent
            v-for="radius in radii"
            :key="radius"
            :radius="radius"
            color="neutral"
            emphasis="tertiary"
            appearance="filled"
          >
            {{ radius }}
          </EqComponent>
        </div>
      </div>

      <div class="eq-design-example__subsection">
        <h3>Padding</h3>
        <div class="eq-design-example__row">
          <EqComponent
            v-for="padding in paddings"
            :key="padding"
            :padding="padding"
            color="info"
            emphasis="tertiary"
            appearance="outlined"
          >
            {{ padding }}
          </EqComponent>
        </div>
      </div>
    </section>

    <section class="eq-design-example__section">
      <div class="eq-design-example__section-heading">
        <h2>Typography</h2>
        <p>Font families, sizes, weights, and the opinionated body styles.</p>
      </div>

      <div class="eq-design-example__type-grid">
        <div class="eq-design-example__subsection">
          <h3>Families</h3>
          <div v-for="family in fontFamilies" :key="family" class="eq-design-example__type-row">
            <code>{{ family }}</code>
            <span :style="{ fontFamily: `var(--eq-font-family-${family})` }">
              The quick brown fox jumps over the lazy dog.
            </span>
          </div>
        </div>

        <div class="eq-design-example__subsection">
          <h3>Weights</h3>
          <div v-for="weight in fontWeights" :key="weight" class="eq-design-example__type-row">
            <code>{{ weight }}</code>
            <span
              :style="{
                fontSize: 'var(--eq-font-size-xl)',
                fontWeight: `var(--eq-font-weight-${weight})`,
              }"
            >
              Component text
            </span>
          </div>
        </div>
      </div>

      <div class="eq-design-example__subsection">
        <h3>Sizes</h3>
        <div v-for="fontSize in fontSizes" :key="fontSize" class="eq-design-example__type-row">
          <code>{{ fontSize }}</code>
          <span :style="{ fontSize: `var(--eq-font-size-${fontSize})` }">
            The quick brown fox jumps over the lazy dog.
          </span>
        </div>
      </div>

      <div class="eq-design-example__subsection">
        <h3>Body</h3>
        <div v-for="bodySize in bodySizes" :key="bodySize" class="eq-design-example__type-row">
          <code>{{ bodySize }}</code>
          <span
            :style="{
              fontSize: `var(--eq-body-${bodySize}-size)`,
              fontWeight: `var(--eq-body-${bodySize}-weight)`,
              lineHeight: `var(--eq-body-${bodySize}-line-height)`,
              letterSpacing: `var(--eq-body-${bodySize}-letter-spacing)`,
            }"
          >
            Body text remains readable and consistent throughout the application.
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { EqComponent } from './src/index';
import type {
  EqAppearance,
  EqBodySize,
  EqColor,
  EqEmphasis,
  EqFontFamily,
  EqFontSize,
  EqFontWeight,
  EqHover,
  EqPadding,
  EqRadius,
  EqSize,
} from './src/types';

const colors: EqColor[] = [
  'neutral',
  'brand',
  'accent',
  'info',
  'success',
  'warning',
  'danger',
  'indigo',
  'orange',
  'mauve',
  'sage',
  'olive',
  'sand',
  'gold',
  'bronze',
  'brown',
  'mint',
  'jade',
  'sky',
  'iris',
  'violet',
  'plum',
  'pink',
];

const emphases: EqEmphasis[] = ['primary', 'secondary', 'tertiary'];
const appearances: EqAppearance[] = ['filled', 'outlined', 'plain'];
const hoverRecipes: { label: string; appearance: EqAppearance; hover: EqHover }[] = [
  { label: 'normal filled', appearance: 'filled', hover: true },
  { label: 'no hover', appearance: 'filled', hover: false },
  { label: 'ghost filled', appearance: 'filled', hover: 'ghost' },
  { label: 'ghost outlined', appearance: 'outlined', hover: 'ghost' },
];
const sizes: EqSize[] = ['xxxs', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl', 'xxxxl'];
const radii: EqRadius[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'round'];
const paddings: EqPadding[] = ['compact', 'standard', 'spacious'];
const fontFamilies: EqFontFamily[] = ['sans', 'mono'];
const fontWeights: EqFontWeight[] = ['light', 'regular', 'medium', 'bold'];
const fontSizes: EqFontSize[] = [
  'xxxs',
  'xxs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
  'xxxl',
  'display-sm',
  'display-md',
  'display-lg',
  'display-xl',
];
const bodySizes: EqBodySize[] = ['sm', 'md', 'lg'];
</script>

<style scoped>
.eq-design-example {
  display: grid;
  gap: var(--eq-space-32);
  color: var(--eq-ink-default);
  font-family: var(--eq-font-family-sans);
}

.eq-design-example__header,
.eq-design-example__section,
.eq-design-example__subsection {
  display: grid;
}

.eq-design-example__header {
  grid-template-columns: minmax(0, 1fr) minmax(16rem, 32rem);
  gap: var(--eq-space-24);
  align-items: end;
}

.eq-design-example__header h1,
.eq-design-example__section h2,
.eq-design-example__subsection h3,
.eq-design-example__header p,
.eq-design-example__section p {
  margin: 0;
}

.eq-design-example__header h1 {
  font-size: var(--eq-font-size-display-md);
  line-height: var(--eq-line-height-tight);
}

.eq-design-example__eyebrow {
  color: var(--eq-ink-accent);
  font-size: var(--eq-font-size-sm);
  font-weight: var(--eq-font-weight-bold);
  letter-spacing: var(--eq-letter-spacing-wide);
  text-transform: uppercase;
}

.eq-design-example__section {
  gap: var(--eq-space-24);
  padding: var(--eq-space-24);
  border: var(--eq-border-width) solid var(--eq-border-default);
  border-radius: var(--eq-radius-xl);
  background: var(--eq-surface-panel);
}

.eq-design-example__section-heading,
.eq-design-example__subsection {
  gap: var(--eq-space-8);
}

.eq-design-example__section-heading h2 {
  font-size: var(--eq-font-size-xxxl);
  line-height: var(--eq-line-height-tight);
}

.eq-design-example__section-heading p,
.eq-design-example__header > p {
  color: var(--eq-ink-muted);
  font-size: var(--eq-body-md-size);
  line-height: var(--eq-body-md-line-height);
}

.eq-design-example__subsection h3 {
  font-size: var(--eq-font-size-xl);
}

.eq-design-example__matrix {
  display: grid;
  grid-template-columns: minmax(6rem, auto) repeat(6, minmax(5rem, 1fr));
  gap: var(--eq-space-8);
  align-items: center;
  overflow-x: auto;
  padding-bottom: var(--eq-space-8);
}

.eq-design-example__matrix-heading,
.eq-design-example__matrix-label,
.eq-design-example__type-row code {
  color: var(--eq-ink-muted);
  font-family: var(--eq-font-family-mono);
  font-size: var(--eq-font-size-xs);
}

.eq-design-example__matrix-heading {
  text-transform: capitalize;
}

.eq-design-example__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--eq-space-12);
  align-items: center;
}

.eq-design-example__row--end {
  align-items: flex-end;
}

.eq-design-example__type-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--eq-space-24);
}

.eq-design-example__type-row {
  display: grid;
  grid-template-columns: minmax(7rem, auto) minmax(0, 1fr);
  gap: var(--eq-space-16);
  align-items: baseline;
  min-width: 0;
  padding-block: var(--eq-space-8);
  border-bottom: var(--eq-border-width) solid var(--eq-border-default);
}

.eq-design-example__type-row span {
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 48rem) {
  .eq-design-example__header,
  .eq-design-example__type-grid {
    grid-template-columns: 1fr;
  }

  .eq-design-example__section {
    padding: var(--eq-space-16);
  }
}
</style>
