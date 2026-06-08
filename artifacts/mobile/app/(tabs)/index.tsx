import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnlineToggle } from "@/components/home/OnlineToggle";
import { OrderCard } from "@/components/order/OrderCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { agent, isOnline } = useAuthStore();
  const { earnings } = useAppStore();
  const { orders, activeOrderId } = useOrderStore();

  const activeOrders = orders.filter((o) => ["accepted", "at_shop", "picked_up", "delivering"].includes(o.status));
  const todayCompleted = orders.filter((o) => o.status === "delivered").length;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
          paddingBottom: insets.bottom + 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(50).duration(500)} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Good morning,</Text>
          <Text style={[styles.name, { color: colors.foreground }]}>{agent?.name || "Agent"} 👋</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable onPress={() => router.push("/notifications/" as any)} style={[styles.notifBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="bell" size={20} color={colors.foreground} />
            <View style={[styles.notifDot, { backgroundColor: colors.primary }]} />
          </Pressable>
        </View>
      </Animated.View>

      {/* Online Toggle Card */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)}>
        <Card style={styles.onlineCard}>
          <OnlineToggle />
          {isOnline && (
            <View style={[styles.shiftBadge, { backgroundColor: colors.successLight, borderRadius: colors.radiusSm }]}>
              <View style={[styles.shiftDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.shiftText, { color: colors.success }]}>Shift Active • 4h 32m</Text>
            </View>
          )}
        </Card>
      </Animated.View>

      {/* Today's Earnings Banner */}
      <Animated.View entering={FadeInDown.delay(150).duration(500)}>
        <LinearGradient
          colors={["#FF6B35", "#E55A26"]}
          style={[styles.earningsBanner, { borderRadius: colors.radius }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View>
            <Text style={styles.earningLabel}>Today's Earnings</Text>
            <View style={styles.earningRow}>
              <MaterialCommunityIcons name="currency-inr" size={24} color="#FFF" />
              <Text style={styles.earningValue}>{earnings.today}</Text>
            </View>
            <Text style={styles.earningOrders}>{earnings.todayOrders} deliveries completed</Text>
          </View>
          <Pressable onPress={() => router.push("/(tabs)/earnings")} style={[styles.viewBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Text style={styles.viewBtnText}>Details</Text>
            <Feather name="arrow-right" size={14} color="#FFF" />
          </Pressable>
        </LinearGradient>
      </Animated.View>

      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.statsRow}>
        <StatCard label="Completed" value={todayCompleted.toString()} subLabel="today" color={colors.success} />
        <StatCard label="Rating" value="4.87" subLabel="avg score" color={colors.accent} />
        <StatCard label="Acceptance" value="94%" subLabel="rate" color={colors.primary} />
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(250).duration(500)}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {[
            { icon: "navigation", label: "Navigate", color: "#007AFF", route: "/delivery/navigate" },
            { icon: "map-pin", label: "Heatmap", color: "#FF9F0A", route: "/delivery/navigate" },
            { icon: "shield", label: "SOS", color: "#FF3B30", route: "/safety/sos" },
            { icon: "headphones", label: "Support", color: "#34C759", route: "/support/" },
          ].map((a) => (
            <Pressable
              key={a.label}
              onPress={() => router.push(a.route as any)}
              style={[styles.quickAction, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}
            >
              <View style={[styles.qaIcon, { backgroundColor: a.color + "18" }]}>
                <Feather name={a.icon as any} size={20} color={a.color} />
              </View>
              <Text style={[styles.qaLabel, { color: colors.foreground }]}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Active Orders</Text>
            <Badge label={`${activeOrders.length}`} variant="primary" />
          </View>
          {activeOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Animated.View>
      )}

      {/* Recent Orders */}
      <Animated.View entering={FadeInDown.delay(350).duration(500)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Deliveries</Text>
          <Pressable onPress={() => router.push("/(tabs)/orders")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </Pressable>
        </View>
        {orders.filter((o) => o.status === "delivered").slice(0, 3).map((o) => (
          <OrderCard key={o.id} order={o} compact />
        ))}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingTop: 16 },
  headerLeft: { gap: 2 },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  name: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  headerRight: {},
  notifBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", borderWidth: 1, position: "relative" },
  notifDot: { position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4, borderWidth: 2, borderColor: "#F7F5F0" },
  onlineCard: { gap: 12 },
  shiftBadge: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, marginTop: 4 },
  shiftDot: { width: 8, height: 8, borderRadius: 4 },
  shiftText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  earningsBanner: { padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  earningLabel: { fontSize: 12, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.8)", marginBottom: 4 },
  earningRow: { flexDirection: "row", alignItems: "center" },
  earningValue: { fontSize: 36, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -1 },
  earningOrders: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", marginTop: 4 },
  viewBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  viewBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#FFF" },
  statsRow: { flexDirection: "row", gap: 10 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  quickActions: { flexDirection: "row", gap: 10 },
  quickAction: { flex: 1, alignItems: "center", padding: 14, gap: 8, borderWidth: 1 },
  qaIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  qaLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
});
