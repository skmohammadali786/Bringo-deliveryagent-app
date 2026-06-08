import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const NOTIFICATIONS = [
  { id: "1", type: "order", title: "New Order Request", body: "Order BRG-2024-004 from Green Mart • ₹65 • 1.5 km", time: "2 min ago", read: false, icon: "package" },
  { id: "2", type: "bonus", title: "Peak Hour Bonus!", body: "You've earned ₹100 peak hour bonus for 3 deliveries between 12–2 PM", time: "1h ago", read: false, icon: "zap" },
  { id: "3", type: "incentive", title: "Incentive Unlocked", body: "Complete 2 more orders to earn ₹200 bonus today!", time: "3h ago", read: true, icon: "award" },
  { id: "4", type: "kyc", title: "Document Verified", body: "Your Aadhaar has been successfully verified. Keep delivering!", time: "Yesterday", read: true, icon: "shield" },
  { id: "5", type: "rating", title: "New Rating Received", body: "Priya S. gave you 5 stars! \"Super fast and professional\"", time: "Yesterday", read: true, icon: "star" },
  { id: "6", type: "payout", title: "Payout Processed", body: "₹2,340 has been credited to your bank account •••1234", time: "2 days ago", read: true, icon: "credit-card" },
];

const TYPE_COLORS: Record<string, string> = {
  order: "#FF6B35",
  bonus: "#FFB800",
  incentive: "#34C759",
  kyc: "#007AFF",
  rating: "#FF9F0A",
  payout: "#34C759",
};

export default function NotificationsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Notifications"
        showBack
        right={
          unreadCount > 0 ? (
            <Pressable onPress={markAllRead}>
              <Text style={[styles.markAll, { color: colors.primary }]}>Mark all</Text>
            </Pressable>
          ) : undefined
        }
      />
      {unreadCount > 0 && (
        <View style={[styles.unreadBar, { backgroundColor: colors.primaryLight }]}>
          <Feather name="bell" size={14} color={colors.primary} />
          <Text style={[styles.unreadText, { color: colors.primary }]}>{unreadCount} unread notifications</Text>
        </View>
      )}
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <EmptyState icon="bell" title="No notifications" subtitle="You'll see order alerts, bonuses, and updates here" />
        ) : (
          notifications.map((notif) => (
            <Pressable
              key={notif.id}
              onPress={() => {
                setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n));
                router.push(`/notifications/${notif.id}` as any);
              }}
              style={[
                styles.notifCard,
                {
                  backgroundColor: notif.read ? colors.card : colors.primaryLight,
                  borderColor: notif.read ? colors.border : colors.primary + "40",
                  borderRadius: colors.radiusSm,
                },
              ]}
            >
              <View style={[styles.notifIcon, { backgroundColor: (TYPE_COLORS[notif.type] ?? colors.primary) + "18" }]}>
                <Feather name={notif.icon as any} size={18} color={TYPE_COLORS[notif.type] ?? colors.primary} />
              </View>
              <View style={styles.notifContent}>
                <View style={styles.notifTop}>
                  <Text style={[styles.notifTitle, { color: colors.foreground }]}>{notif.title}</Text>
                  {!notif.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={[styles.notifBody, { color: colors.mutedForeground }]} numberOfLines={2}>{notif.body}</Text>
                <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{notif.time}</Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  markAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  unreadBar: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 10 },
  unreadText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  content: { paddingHorizontal: 20, gap: 10 },
  notifCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14, borderWidth: 1 },
  notifIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  notifContent: { flex: 1, gap: 4 },
  notifTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  notifTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notifBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  notifTime: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
