import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnlineToggle } from "@/components/home/OnlineToggle";
import { OrderCard } from "@/components/order/OrderCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";

const { width } = Dimensions.get("window");

const QUICK_ACTIONS = [
  { icon: "navigation" as const, label: "Navigate", color: "#4A90E2", bg: "#EBF3FC", route: "/delivery/navigate" },
  { icon: "map" as const, label: "Heatmap", color: "#FF9A3D", bg: "#FFF5E6", route: "/(tabs)/map" },
  { icon: "alert-triangle" as const, label: "SOS", color: "#FF4D4F", bg: "#FFECEC", route: "/safety/sos" },
  { icon: "headphones" as const, label: "Support", color: "#34C759", bg: "#E8F9EC", route: "/support/" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { agent, isOnline } = useAuthStore();
  const { earnings, acceptanceRate, completionRate, avgRating, shiftStartTime, totalHoursToday } = useAppStore();
  const { orders, activeOrderId } = useOrderStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const activeOrders = orders.filter((o) =>
    ["new", "accepted", "at_shop", "picked_up", "delivering"].includes(o.status)
  );
  const recentDelivered = orders.filter((o) => o.status === "delivered").slice(0, 3);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const shiftDuration = shiftStartTime
    ? Math.floor((Date.now() - new Date(shiftStartTime).getTime()) / 60000)
    : totalHoursToday * 60;

  const shiftHours = Math.floor(shiftDuration / 60);
  const shiftMins = shiftDuration % 60;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
          paddingBottom: insets.bottom + 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      {/* ─── Header ─── */}
      <Animated.View entering={FadeInDown.delay(0).duration(500)} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            {getGreeting()},
          </Text>
          <Text style={[styles.name, { color: colors.foreground }]}>
            {agent?.name?.split(" ")[0] || "Agent"} 👋
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            onPress={() => router.push("/notifications/" as any)}
            style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Feather name="bell" size={20} color={colors.foreground} />
            <View style={[styles.notifDot, { backgroundColor: colors.primary }]} />
          </Pressable>
        </View>
      </Animated.View>

      {/* ─── Online Toggle ─── */}
      <Animated.View entering={FadeInDown.delay(80).duration(500)}>
        <Card style={styles.onlineCard}>
          <OnlineToggle />
          {isOnline && (
            <View style={[styles.shiftRow, { backgroundColor: colors.successLight, borderRadius: 12 }]}>
              <View style={[styles.shiftDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.shiftText, { color: colors.success }]}>
                Shift Active • {shiftHours}h {shiftMins.toString().padStart(2, "0")}m
              </Text>
              <View style={[styles.shiftEarning, { backgroundColor: colors.success }]}>
                <Text style={styles.shiftEarningText}>₹{earnings.today}</Text>
              </View>
            </View>
          )}
        </Card>
      </Animated.View>

      {/* ─── Earnings Hero ─── */}
      <Animated.View entering={FadeInDown.delay(150).duration(500)}>
        <LinearGradient
          colors={["#FF6B35", "#E8501C"]}
          style={[styles.earningsHero, { borderRadius: colors.radius }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.earningsTop}>
            <View>
              <Text style={styles.earningsLabel}>Today's Earnings</Text>
              <View style={styles.earningsRow}>
                <MaterialCommunityIcons name="currency-inr" size={28} color="rgba(255,255,255,0.9)" />
                <Text style={styles.earningsValue}>{earnings.today.toLocaleString("en-IN")}</Text>
              </View>
              <Text style={styles.earningsSub}>
                {earnings.todayOrders} deliveries · ₹{earnings.incentives} bonus
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/(tabs)/earnings")}
              style={[styles.viewDetailsBtn, { backgroundColor: "rgba(255,255,255,0.18)" }]}
            >
              <Text style={styles.viewDetailsBtnText}>Details</Text>
              <Feather name="arrow-right" size={13} color="#FFF" />
            </Pressable>
          </View>

          <View style={[styles.earningsStats, { borderTopColor: "rgba(255,255,255,0.2)" }]}>
            {[
              { label: "Deliveries", value: earnings.todayOrders.toString() },
              { label: "Avg per order", value: `₹${Math.round(earnings.today / Math.max(earnings.todayOrders, 1))}` },
              { label: "Online hours", value: `${shiftHours}h ${shiftMins.toString().padStart(2, "0")}m` },
            ].map((s, i) => (
              <View key={s.label} style={[styles.earningsStat, i > 0 && { borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.2)" }]}>
                <Text style={styles.earningsStatVal}>{s.value}</Text>
                <Text style={styles.earningsStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* ─── Performance Stats ─── */}
      <Animated.View entering={FadeInDown.delay(220).duration(500)} style={styles.statsRow}>
        {[
          { label: "Rating", value: avgRating.toFixed(2), color: colors.accent, icon: "star" as const },
          { label: "Acceptance", value: `${acceptanceRate}%`, color: colors.success, icon: "check-circle" as const },
          { label: "Completion", value: `${completionRate}%`, color: colors.accentPurple, icon: "award" as const },
        ].map((s) => (
          <Card key={s.label} style={styles.statCard} shadow>
            <View style={[styles.statIcon, { backgroundColor: s.color + "18" }]}>
              <Feather name={s.icon} size={16} color={s.color} />
            </View>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </Card>
        ))}
      </Animated.View>

      {/* ─── Quick Actions ─── */}
      <Animated.View entering={FadeInDown.delay(290).duration(500)}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((a) => (
            <Pressable
              key={a.label}
              onPress={() => router.push(a.route as any)}
              style={[styles.quickAction, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}
            >
              <View style={[styles.qaIconWrap, { backgroundColor: a.bg }]}>
                <Feather name={a.icon} size={22} color={a.color} />
              </View>
              <Text style={[styles.qaLabel, { color: colors.foreground }]}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {/* ─── Active Orders ─── */}
      {activeOrders.length > 0 && (
        <Animated.View entering={FadeInDown.delay(360).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Active Orders</Text>
            <Badge label={`${activeOrders.length} active`} variant="primary" />
          </View>
          {activeOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Animated.View>
      )}

      {/* ─── Weekly Progress ─── */}
      <Animated.View entering={FadeInDown.delay(420).duration(500)}>
        <Pressable
          onPress={() => router.push("/performance/" as any)}
          style={[styles.weeklyCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
        >
          <View style={styles.weeklyHeader}>
            <View>
              <Text style={[styles.weeklyTitle, { color: colors.foreground }]}>Weekly Progress</Text>
              <Text style={[styles.weeklySub, { color: colors.mutedForeground }]}>
                ₹{earnings.week.toLocaleString("en-IN")} · {earnings.weekOrders} deliveries
              </Text>
            </View>
            <View style={[styles.weeklyBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.weeklyBadgeText, { color: colors.primary }]}>Top 10%</Text>
            </View>
          </View>
          <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${Math.min((earnings.weekOrders / 50) * 100, 100)}%` }]} />
          </View>
          <View style={styles.weeklyFooter}>
            <Text style={[styles.weeklyProgressText, { color: colors.mutedForeground }]}>
              {earnings.weekOrders}/50 orders target
            </Text>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </View>
        </Pressable>
      </Animated.View>

      {/* ─── Incentive Banner ─── */}
      <Animated.View entering={FadeInDown.delay(480).duration(500)}>
        <Pressable
          onPress={() => router.push("/earnings/incentives" as any)}
          style={[styles.incentiveBanner, { backgroundColor: colors.accentLight, borderColor: colors.accent + "40", borderRadius: colors.radiusSm }]}
        >
          <View style={[styles.incentiveIcon, { backgroundColor: colors.accent + "25" }]}>
            <Feather name="zap" size={20} color={colors.accent} />
          </View>
          <View style={styles.incentiveText}>
            <Text style={[styles.incentiveTitle, { color: colors.foreground }]}>
              Complete 5 more orders today
            </Text>
            <Text style={[styles.incentiveSub, { color: colors.mutedForeground }]}>
              Earn ₹200 peak bonus • 3/5 completed
            </Text>
          </View>
          <View style={[styles.incentiveArrow, { backgroundColor: colors.accent }]}>
            <Feather name="arrow-right" size={14} color="#FFF" />
          </View>
        </Pressable>
      </Animated.View>

      {/* ─── Recent Deliveries ─── */}
      {recentDelivered.length > 0 && (
        <Animated.View entering={FadeInDown.delay(540).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Deliveries</Text>
            <Pressable onPress={() => router.push("/(tabs)/orders")}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </Pressable>
          </View>
          {recentDelivered.map((order) => (
            <OrderCard key={order.id} order={order} compact />
          ))}
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 16,
  },
  headerLeft: { gap: 2 },
  greeting: { fontSize: 14, fontFamily: "Inter_400Regular" },
  name: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.7 },
  headerRight: {},
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  notifDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#F7F5F0",
  },
  onlineCard: { gap: 14 },
  shiftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    marginTop: 4,
  },
  shiftDot: { width: 8, height: 8, borderRadius: 4 },
  shiftText: { flex: 1, fontSize: 13, fontFamily: "Inter_600SemiBold" },
  shiftEarning: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  shiftEarningText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#FFF" },
  earningsHero: { padding: 0, overflow: "hidden" },
  earningsTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 24,
    paddingBottom: 20,
  },
  earningsLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 6,
  },
  earningsRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  earningsValue: {
    fontSize: 44,
    fontFamily: "Inter_700Bold",
    color: "#FFF",
    letterSpacing: -1.5,
  },
  earningsSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
  },
  viewDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewDetailsBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#FFF",
  },
  earningsStats: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  earningsStat: { flex: 1, alignItems: "center", gap: 4, paddingHorizontal: 4 },
  earningsStatVal: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#FFF",
    letterSpacing: -0.4,
  },
  earningsStatLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
  },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, padding: 14, gap: 8, alignItems: "flex-start" },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  quickGrid: { flexDirection: "row", gap: 10 },
  quickAction: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    gap: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  qaIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  qaLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  weeklyCard: {
    padding: 20,
    gap: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  weeklyHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  weeklyTitle: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  weeklySub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  weeklyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  weeklyBadgeText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  progressBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  weeklyFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  weeklyProgressText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  incentiveBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1,
  },
  incentiveIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  incentiveText: { flex: 1, gap: 3 },
  incentiveTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  incentiveSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  incentiveArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
