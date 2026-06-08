import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { useColors } from "@/hooks/useColors";

const NOTIFICATIONS = [
  {
    id: "1",
    type: "order",
    title: "New Order Request!",
    body: "Order #BRG-2847 from Green Mart — ₹180 earnings",
    time: "2 min ago",
    read: false,
    icon: "package",
    color: "#FF6B35",
  },
  {
    id: "2",
    type: "earnings",
    title: "Payout Credited 🎉",
    body: "₹847 has been credited to your HDFC account",
    time: "1 hr ago",
    read: false,
    icon: "trending-up",
    color: "#34C759",
  },
  {
    id: "3",
    type: "achievement",
    title: "Badge Unlocked!",
    body: "You've earned the 'Speed Demon' badge",
    time: "3 hr ago",
    read: true,
    icon: "award",
    color: "#FFB800",
  },
  {
    id: "4",
    type: "surge",
    title: "Surge Zone Active! ⚡",
    body: "2.4× surge in BTM Layout — Earn more now!",
    time: "4 hr ago",
    read: true,
    icon: "zap",
    color: "#7C5CFF",
  },
  {
    id: "5",
    type: "system",
    title: "Weekly Summary Available",
    body: "Your performance report for last week is ready",
    time: "Yesterday",
    read: true,
    icon: "bar-chart-2",
    color: "#4A90E2",
  },
  {
    id: "6",
    type: "order",
    title: "Delivery Completed ✓",
    body: "Order #BRG-2831 delivered. Rating: ⭐⭐⭐⭐⭐",
    time: "Yesterday",
    read: true,
    icon: "check-circle",
    color: "#34C759",
  },
  {
    id: "7",
    type: "safety",
    title: "Safety Reminder",
    body: "You've been active for 4 hours. Take a short break!",
    time: "2 days ago",
    read: true,
    icon: "heart",
    color: "#FF4D4F",
  },
];

type FilterType = "All" | "Orders" | "Earnings" | "Alerts";
const FILTERS: FilterType[] = ["All", "Orders", "Earnings", "Alerts"];

export default function NotificationsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>("All");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Orders") return n.type === "order";
    if (filter === "Earnings") return n.type === "earnings";
    if (filter === "Alerts") return ["surge", "safety", "system"].includes(n.type);
    return true;
  });

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16), paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={[styles.pageTitle, { color: colors.foreground }]}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={[styles.unreadCount, { color: colors.mutedForeground }]}>
              {unreadCount} unread
            </Text>
          )}
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={markAllRead} style={[styles.markAllBtn, { backgroundColor: colors.primaryLight, borderRadius: 12 }]}>
            <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterChip,
              { backgroundColor: filter === f ? colors.primary : colors.card, borderColor: filter === f ? colors.primary : colors.border },
            ]}
          >
            <Text style={[styles.filterText, { color: filter === f ? "#FFF" : colors.foreground }]}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="bell-off" size={48} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No notifications</Text>
        </View>
      ) : (
        <Card padding={0}>
          {filtered.map((notif, i) => (
            <Animated.View key={notif.id} entering={FadeInDown.delay(i * 50).duration(400)}>
              <Pressable
                onPress={() => {
                  setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n));
                  router.push(`/notifications/${notif.id}` as any);
                }}
                style={({ pressed }) => [
                  styles.notifRow,
                  {
                    borderBottomColor: colors.border,
                    borderBottomWidth: i < filtered.length - 1 ? 1 : 0,
                    backgroundColor: pressed ? colors.muted + "40" : notif.read ? "transparent" : colors.primaryLight + "60",
                  },
                ]}
              >
                <View style={[styles.notifIcon, { backgroundColor: notif.color + "18" }]}>
                  <Feather name={notif.icon as any} size={20} color={notif.color} />
                </View>
                <View style={styles.notifContent}>
                  <Text style={[styles.notifTitle, { color: colors.foreground, fontFamily: notif.read ? "Inter_500Medium" : "Inter_700Bold" }]}>
                    {notif.title}
                  </Text>
                  <Text style={[styles.notifBody, { color: colors.mutedForeground }]} numberOfLines={2}>
                    {notif.body}
                  </Text>
                  <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{notif.time}</Text>
                </View>
                {!notif.read && (
                  <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                )}
              </Pressable>
            </Animated.View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 16 },
  pageHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  pageTitle: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  unreadCount: { fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 3 },
  markAllBtn: { paddingHorizontal: 12, paddingVertical: 8, marginTop: 4 },
  markAllText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  filterRow: {},
  filterContent: { gap: 8, paddingBottom: 4 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  notifRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14 },
  notifIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 2 },
  notifContent: { flex: 1, gap: 3 },
  notifTitle: { fontSize: 14, lineHeight: 20 },
  notifBody: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  notifTime: { fontSize: 11, fontFamily: "Inter_400Regular" },
  unreadDot: { width: 9, height: 9, borderRadius: 4.5, marginTop: 6 },
  empty: { alignItems: "center", paddingTop: 80, gap: 14 },
  emptyText: { fontSize: 16, fontFamily: "Inter_400Regular" },
});
