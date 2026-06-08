import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const SAMPLE_NOTIFICATIONS: Record<string, { title: string; body: string; time: string; type: string; detail: string; color: string; icon: string }> = {
  "1": { title: "New Order Request!", body: "Order #BRG-2847 from Green Mart — ₹180 earnings", time: "2 min ago", type: "order", detail: "A new order has arrived from Green Mart. 4 items to pick up. Estimated delivery time: 25 minutes. Earnings: ₹180 (base) + surge multiplier.", color: "#FF6B35", icon: "package" },
  "2": { title: "Payout Credited 🎉", body: "₹847 has been credited to your HDFC account", time: "1 hr ago", type: "earnings", detail: "Your daily payout of ₹847 from 7 deliveries has been successfully credited to your HDFC Bank account ending in 1234. Transaction ID: TXN-4829347.", color: "#34C759", icon: "trending-up" },
  "3": { title: "Badge Unlocked!", body: "You've earned the 'Speed Demon' badge", time: "3 hr ago", type: "achievement", detail: "Congratulations! You've completed 50 deliveries in under 20 minutes each. You've earned the Speed Demon badge, which comes with a ₹200 bonus reward.", color: "#FFB800", icon: "award" },
  "4": { title: "Surge Zone Active! ⚡", body: "2.4× surge in BTM Layout — Earn more now!", time: "4 hr ago", type: "surge", detail: "High demand in BTM Layout area. Surge multiplier: 2.4×. Move to this area to earn significantly more per delivery. Surge expected to last for the next 2 hours.", color: "#7C5CFF", icon: "zap" },
};

export default function NotificationDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const notif = SAMPLE_NOTIFICATIONS[id ?? "1"] ?? SAMPLE_NOTIFICATIONS["1"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Notification" showBack />
      <View style={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}>
        {/* Icon Header */}
        <View style={styles.iconHeader}>
          <View style={[styles.iconCircle, { backgroundColor: notif.color + "18" }]}>
            <Feather name={notif.icon as any} size={40} color={notif.color} />
          </View>
          <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{notif.time}</Text>
        </View>

        {/* Content */}
        <Card style={styles.contentCard}>
          <Text style={[styles.title, { color: colors.foreground }]}>{notif.title}</Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>{notif.body}</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.detail, { color: colors.foreground }]}>{notif.detail}</Text>
        </Card>

        {/* Action Buttons */}
        {notif.type === "order" && (
          <Pressable
            onPress={() => router.push("/(tabs)/" as any)}
            style={[styles.actionBtn, { backgroundColor: colors.primary, borderRadius: colors.radiusSm }]}
          >
            <Feather name="package" size={18} color="#FFF" />
            <Text style={styles.actionBtnText}>View Order</Text>
          </Pressable>
        )}
        {notif.type === "earnings" && (
          <Pressable
            onPress={() => router.push("/(tabs)/earnings" as any)}
            style={[styles.actionBtn, { backgroundColor: colors.success, borderRadius: colors.radiusSm }]}
          >
            <Feather name="trending-up" size={18} color="#FFF" />
            <Text style={styles.actionBtnText}>View Earnings</Text>
          </Pressable>
        )}
        {notif.type === "achievement" && (
          <Pressable
            onPress={() => router.push("/performance/badges" as any)}
            style={[styles.actionBtn, { backgroundColor: "#FFB800", borderRadius: colors.radiusSm }]}
          >
            <Feather name="award" size={18} color="#FFF" />
            <Text style={styles.actionBtnText}>View Badges</Text>
          </Pressable>
        )}
        {notif.type === "surge" && (
          <Pressable
            onPress={() => router.push("/(tabs)/map" as any)}
            style={[styles.actionBtn, { backgroundColor: colors.accentPurple, borderRadius: colors.radiusSm }]}
          >
            <Feather name="map" size={18} color="#FFF" />
            <Text style={styles.actionBtnText}>View Map</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  iconHeader: { alignItems: "center", gap: 12, paddingVertical: 20 },
  iconCircle: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
  notifTime: { fontSize: 13, fontFamily: "Inter_400Regular" },
  contentCard: { gap: 14 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6, lineHeight: 30 },
  body: { fontSize: 15, fontFamily: "Inter_500Medium", lineHeight: 24 },
  divider: { height: 1 },
  detail: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 24 },
  actionBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, padding: 16 },
  actionBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFF" },
});
