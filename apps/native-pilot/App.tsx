import { useState } from 'react'
import { AccessibilityInfo, ScrollView, StatusBar, Text, View, useColorScheme } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Button, Switch } from '@my-design-system/react-native'
import { themes } from '@my-design-system/tokens/native'
import type { ThemeName } from '@my-design-system/tokens/native'

export default function App() {
  return <SafeAreaProvider><Preferences /></SafeAreaProvider>
}

function Preferences() {
  const systemTheme = useColorScheme()
  const [appearance, setAppearance] = useState<ThemeName>()
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [savedDigest, setSavedDigest] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const theme = appearance ?? (systemTheme === 'dark' ? 'dark' : 'light')
  const { color, space, radius, font } = themes[theme]
  const dirty = weeklyDigest !== savedDigest

  function save() {
    if (!dirty) return
    setSavedDigest(weeklyDigest)
    setConfirmation('Preferences saved.')
    AccessibilityInfo.announceForAccessibility('Preferences saved.')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.canvas }}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={{ padding: space.large, alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: 560, gap: space.large }}>
          <View style={{ gap: space.small }}>
            <Text accessibilityRole="header" style={{ color: color.text, fontSize: font.title, fontWeight: '700' }}>
              Notification preferences
            </Text>
            <Text style={{ color: color.muted, fontSize: font.body }}>Choose which updates you get by email.</Text>
          </View>
          <View style={{
            backgroundColor: color.surface,
            padding: space.large,
            borderColor: color.border,
            borderWidth: 1,
            borderRadius: radius.panel,
            gap: space.medium,
          }}>
            <Text accessibilityRole="header" style={{ color: color.text, fontSize: 18, fontWeight: '600' }}>
              Email updates
            </Text>
            <Switch
              theme={theme}
              label="Weekly digest"
              description="Get one email with the highlights from your account."
              value={weeklyDigest}
              onValueChange={(value) => {
                setWeeklyDigest(value)
                setConfirmation('')
              }}
            />
            <View style={{ borderTopColor: color.border, borderTopWidth: 1, paddingTop: space.medium, gap: space.small }}>
              <Button theme={theme} label="Save preferences" disabled={!dirty} onPress={save} />
              {confirmation !== '' && <Text style={{ color: color.muted }}>{confirmation}</Text>}
            </View>
          </View>
          <Switch theme={theme} label="Dark appearance" value={theme === 'dark'}
            onValueChange={(value) => setAppearance(value ? 'dark' : 'light')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
