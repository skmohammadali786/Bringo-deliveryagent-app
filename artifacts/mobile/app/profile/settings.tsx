import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [locationBg, setLocationBg] = useState(true);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: colors.muted, true: colors.primary }}
      thumbColor="#FFF"
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="App Settings" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>APPEARANCE</Text>
        <Card padding={0}>
          {[
            { label: "Dark Mode", icon: "moon", value: darkMode, onChange: setDarkMode },
          ].map((s, i) => (
            <View key={s.label} style={[styles.settingRow, { borderBottomColor: colors.border, borderBottomWidth: 0 }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.muted }]}>
                <Feather name={s.icon as any} size={16} color={colors.foreground} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.foreground }]}>{s.label}</Text>
              <Toggle value={s.value} onChange={s.onChange} />
            </View>
          ))}
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>ALERTS & SOUNDS</Text>
        <Card padding={0}>
          {[
            { label: "Sound Alerts", icon: "volume-2", value: soundAlerts, onChange: setSoundAlerts },
            { label: "Vibration", icon: "smartphone", value: vibration, onChange: setVibration },
          ].map((s, i) => (
            <View key={s.label} style={[styles.settingRow, { borderBottomColor: colors.border, borderBottomWidth: i === 0 ? 1 : 0 }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.muted }]}>
                <Feather name={s.icon as any} size={16} color={colors.foreground} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.foreground }]}>{s.label}</Text>
              <Toggle value={s.value} onChange={s.onChange} />
            </View>
          ))}
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>PRIVACY</Text>
        <Card padding={0}>
          {[
            { label: "Background Location", icon: "map-pin", value: locationBg, onChange: setLocationBg },
          ].map((s) => (
            <View key={s.label} style={[styles.settingRow, { borderBottomColor: colors.border, borderBottomWidth: 0 }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.muted }]}>
                <Feather name={s.icon as any} size={16} color={colors.foreground} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.foreground }]}>{s.label}</Text>
              <Toggle value={s.value} onChange={s.onChange} />
            </View>
          ))}
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>MORE</Text>
        <Card padding={0}>
          {[
            { icon: "globe", label: "Language", route: "/profile/language" },
            { icon: "bell", label: "Notification Settings", route: "/profile/notification-settings" },
            { icon: "lock", label: "Privacy Settings", route: "/profile/privacy" },
          ].map((item, i) => (
            <Pressable key={item.label} onPress={() => router.push(item.route as any)} style={[styles.settingRow, { borderBottomColor: colors.border, borderBottomWidth: i < 2 ? 1 : 0 }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.muted }]}>
                <Feather name={item.icon as any} size={16} color={colors.foreground} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 10 },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, marginTop: 10 },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  settingLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
});
