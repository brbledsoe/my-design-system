import { themes } from '@my-design-system/tokens/native'
import type { ThemeName } from '@my-design-system/tokens/native'
import { Pressable, Text, View } from 'react-native'

interface SwitchProps {
  label: string
  description?: string
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
  theme?: ThemeName
}

export function Switch({ label, description, value, onValueChange, disabled = false, theme = 'light' }: SwitchProps) {
  const { color, size, space, font } = themes[theme]
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={({ pressed }) => ({
        minHeight: size.control,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.medium,
        opacity: disabled || pressed ? 0.65 : 1,
      })}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ color: color.text, fontWeight: '600', fontSize: font.body }}>{label}</Text>
        {description && <Text style={{ color: color.muted, fontSize: 14 }}>{description}</Text>}
      </View>
      <View style={{
        width: size.control,
        height: 28,
        borderRadius: 14,
        paddingHorizontal: 4,
        justifyContent: 'center',
        alignItems: value ? 'flex-end' : 'flex-start',
        backgroundColor: value ? color.action : color.trackOff,
      }}>
        <View style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: value ? color.onAction : color.thumb,
        }} />
      </View>
    </Pressable>
  )
}
