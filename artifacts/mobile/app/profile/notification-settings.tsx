import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const NOTIFICATION_TYPES = [
  { key: "new_orders", label: "New Order Requests", desc: "Incoming order alerts" },
  { key: "bonuses", label: "Bonuses & Incentives", desc: "Reward and earning alerts" },
  { key: "ratings", label: "Customer Ratings", desc: "New review notifications" },
  { key: "payments", label: "Payment Updates", desc: "Payout and transaction alerts" },
  { key: "kyc", label: "KYC & Documents", desc: "Document status updates" },
  { key: "app_updates", label: "App Updates", desc: "New features and announcements" },
];

export default function NotificationSettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_TYPES.map((t) => [t.key, true]))
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Notification Settings" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Card padding={0}>
          {NOTIFICATION_TYPES.map((t, i) => (
            <View key={t.key} style={[styles.row, { borderBottomColor: colors.border, borderBottomWidth: i < NOTIFICATION_TYPES.length - 1 ? 1 : 0 }]}>
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: colors.foreground }]}>{t.label}</Text>
                <Text style={[styles.rowDesc, { color: colors.mutedForeground }]}>{t.desc}</Text>
              </View>
              <Switch
                value={settings[t.key]}
                onValueChange={(v) => setSettings((s) => ({ ...s, [t.key]: v }))}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="#FFF"
              />
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  row: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
  rowDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
