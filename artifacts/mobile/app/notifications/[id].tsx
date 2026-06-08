import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const NOTIFICATIONS: Record<string, { title: string; body: string; time: string }> = {
  "1": { title: "New Order Request", body: "Order BRG-2024-004 from Green Mart • ₹65 delivery fee • 1.5 km away from your current location. Customer: Rajesh Kumar at Koramangala 4th Block.", time: "2 min ago" },
  "2": { title: "Peak Hour Bonus!", body: "You've earned ₹100 peak hour bonus for completing 3 deliveries between 12–2 PM. The bonus will be credited to your account within 24 hours.", time: "1h ago" },
};

export default function NotificationDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const notif = NOTIFICATIONS[id ?? ""] ?? { title: "Notification", body: "Notification details not available.", time: "—" };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Notification" showBack />
      <View style={[styles.content]}>
        <Text style={[styles.title, { color: colors.foreground }]}>{notif.title}</Text>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>{notif.time}</Text>
        <Text style={[styles.body, { color: colors.foreground }]}>{notif.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 24, gap: 12 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  time: { fontSize: 13, fontFamily: "Inter_400Regular" },
  body: { fontSize: 16, fontFamily: "Inter_400Regular", lineHeight: 26 },
});
