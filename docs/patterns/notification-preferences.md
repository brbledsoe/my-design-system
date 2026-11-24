# Notification preferences

The example apps share the same task and design values. They own their respective screens and use the design system's Button and Switch.

| Intent | Web | Native |
| --- | --- | --- |
| Change the weekly digest preference | Labeled checkbox with switch semantics. Space changes the value. | Press target with a switch role, checked state, and accessibility hint. |
| Save a changed preference | Submit button. A status region reports success. | Press target with a button role. The app announces success through accessibility services. |
| Return to the saved value | Save becomes disabled. | Save becomes disabled. |
| Set appearance | Theme attributes apply CSS custom properties. | The app passes the selected theme to the controls. |

Token sources live in `packages/tokens/src`. The generator handles sRGB colors, pixel dimensions, and whole-token aliases. Shared role names and dimension scales are in `common.json`. Light and dark palettes are in their respective files. A pixel design value emits a CSS length and a density-independent JS number. Keep public names and types stable when editing token values.
