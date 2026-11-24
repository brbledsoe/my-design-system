import { themes } from '@my-design-system/tokens/native'
import type { ThemeName } from '@my-design-system/tokens/native'
import { Pressable, Text } from 'react-native'

interface ButtonProps {
  label: string
  onPress: () => void
  disabled?: boolean
  theme?: ThemeName
}

export function Button({ label, onPress, disabled = false, theme = 'light' }: ButtonProps) {
  const { color, size, space, radius, font } = themes[theme]
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: size.control,
        minWidth: size.control,
        paddingHorizontal: space.medium,
        paddingVertical: space.small,
        borderRadius: radius.control,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: disabled ? color.disabled : pressed ? color.pressed : color.action,
      })}
    >
      <Text style={{ color: disabled ? color.onDisabled : color.onAction, fontWeight: '600', fontSize: font.body }}>
        {label}
      </Text>
    </Pressable>
  )
}
