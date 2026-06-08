import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const PRIVACY_SETTINGS = [
  {
    section: "Location",
    items: [
      { id: "loc_shift", label: "Share Location During Shift", sub: "Required for order tracking", default: true, required: true },
      { id: "loc_off", label: "Share Location Off-Shift", sub: "For nearby order alerts", default: false },
    ],
  },
  {
    section: "Data & Analytics",
    items: [
      { id: "analytics", label: "Usage Analytics", sub: "Help us improve the app", default: true },
      { id: "crash", label: "Crash Reports", sub: "Automatically send crash logs", default: true },
      { id: "personalize", label: "Personalized Experience", sub: "Tailored tips and insights", default: false },
    ],
  },
  {
    section: "Communications",
    items: [
      { id: "sms", label: "SMS Notifications", sub: "Order updates via SMS", default: true },
      { id: "whatsapp", label: "WhatsApp Updates", sub: "Shift reminders on WhatsApp", default: false },
    ],
  },
];

export default function PrivacyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const initialState: Record<string, boolean> = {};
  PRIVACY_SETTINGS.forEach((g) => g.items.forEach((i) => { initialState[i.id] = i.default; }));
  const [settings, setSettings] = useState(initialState);

  const toggle = (id: string, required?: boolean) => {
    if (required) return;
    setSettings((s) => ({ ...s, [id]: !s[id] }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Privacy & Data" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <Card style={[styles.infoBanner, { backgroundColor: colors.infoLight }]}>
            <Feather name="shield" size={20} color={colors.info} />
            <Text style={[styles.infoText, { color: colors.info }]}>
              Your data is encrypted and never sold to third parties. You control what we can access.
            </Text>
          </Card>
        </Animated.View>

        {PRIVACY_SETTINGS.map((group, gi) => (
          <Animated.View key={group.section} entering={FadeInDown.delay(60 + gi * 60).duration(400)}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{group.section.toUpperCase()}</Text>
            <Card padding={0}>
              {group.items.map((item, ii) => (
                <View
                  key={item.id}
                  style={[
                    styles.settingRow,
                    { borderBottomColor: colors.border, borderBottomWidth: ii < group.items.length - 1 ? 1 : 0 },
                  ]}
                >
                  <View style={styles.settingInfo}>
                    <View style={styles.settingLabelRow}>
                      <Text style={[styles.settingLabel, { color: colors.foreground }]}>{item.label}</Text>
                      {item.required && (
                        <View style={[styles.requiredBadge, { backgroundColor: colors.warningLight }]}>
                          <Text style={[styles.requiredText, { color: colors.warning }]}>Required</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.settingSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
                  </View>
                  <Switch
                    value={settings[item.id]}
                    onValueChange={() => toggle(item.id, item.required)}
                    trackColor={{ false: colors.muted, true: item.required ? colors.muted : colors.primary }}
                    thumbColor="#FFF"
                    disabled={item.required}
                  />
                </View>
              ))}
            </Card>
          </Animated.View>
        ))}

        {/* Data Download */}
        <Animated.View entering={FadeInDown.delay(260).duration(400)}>
          <Card style={styles.dataCard}>
            <View style={[styles.dataIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name="download" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dataTitle, { color: colors.foreground }]}>Download Your Data</Text>
              <Text style={[styles.dataSub, { color: colors.mutedForeground }]}>
                Get a copy of all data we have about you
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320).duration(400)}>
          <Pressable style={[styles.deleteBtn, { borderColor: colors.destructive + "40", borderRadius: colors.radiusSm }]}>
            <Feather name="trash-2" size={16} color={colors.destructive} />
            <Text style={[styles.deleteTxt, { color: colors.destructive }]}>Delete My Account</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  infoBanner: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14 },
  infoText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8, marginBottom: 8 },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  settingInfo: { flex: 1, gap: 3 },
  settingLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  settingLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  requiredBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  requiredText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  settingSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  dataCard: { flexDirection: "row", alignItems: "center", gap: 14 },
  dataIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  dataTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  dataSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  deleteBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderWidth: 1 },
  deleteTxt: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
