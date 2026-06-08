import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDown } from "@/constants/animations";

const NOTIFICATION_GROUPS = [
  {
    title: "Orders",
    items: [
      { id: "new_order", label: "New Order Requests", sub: "Get notified when new orders arrive", default: true },
      { id: "order_update", label: "Order Updates", sub: "Status changes and customer messages", default: true },
      { id: "order_cancel", label: "Order Cancellations", sub: "When an order is cancelled", default: true },
    ],
  },
  {
    title: "Earnings",
    items: [
      { id: "payout", label: "Payout Confirmation", sub: "When earnings are credited", default: true },
      { id: "incentive", label: "Incentive Alerts", sub: "New bonus and surge notifications", default: true },
      { id: "weekly", label: "Weekly Summary", sub: "Weekly performance summary", default: false },
    ],
  },
  {
    title: "Promotions",
    items: [
      { id: "promo", label: "Promotional Offers", sub: "Referral and special offers", default: false },
      { id: "tips", label: "Performance Tips", sub: "Tips to improve your ratings", default: true },
    ],
  },
  {
    title: "Safety",
    items: [
      { id: "safety", label: "Safety Alerts", sub: "Safety tips and reminders", default: true },
      { id: "sos", label: "SOS Confirmations", sub: "Emergency alert confirmations", default: true },
    ],
  },
];

export default function NotificationSettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const initialState: Record<string, boolean> = {};
  NOTIFICATION_GROUPS.forEach((g) => g.items.forEach((i) => { initialState[i.id] = i.default; }));
  const [settings, setSettings] = useState(initialState);

  const toggle = (id: string) => setSettings((s) => ({ ...s, [id]: !s[id] }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Notifications" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {NOTIFICATION_GROUPS.map((group, gi) => (
          <Animated.View key={group.title} entering={fadeInDown(gi)}>
            <Text style={[styles.groupTitle, { color: colors.mutedForeground }]}>{group.title.toUpperCase()}</Text>
            <Card padding={0}>
              {group.items.map((item, ii) => (
                <View
                  key={item.id}
                  style={[
                    styles.itemRow,
                    { borderBottomColor: colors.border, borderBottomWidth: ii < group.items.length - 1 ? 1 : 0 },
                  ]}
                >
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemLabel, { color: colors.foreground }]}>{item.label}</Text>
                    <Text style={[styles.itemSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
                  </View>
                  <Switch
                    value={settings[item.id]}
                    onValueChange={() => toggle(item.id)}
                    trackColor={{ false: colors.muted, true: colors.primary }}
                    thumbColor="#FFF"
                  />
                </View>
              ))}
            </Card>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  groupTitle: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8, marginBottom: 8 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  itemInfo: { flex: 1, gap: 2 },
  itemLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  itemSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
