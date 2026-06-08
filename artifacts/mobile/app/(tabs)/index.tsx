import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
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
import Animated, { FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnlineToggle } from "@/components/home/OnlineToggle";
import { OrderRequestSheet } from "@/components/home/OrderRequestSheet";
import { OrderCard } from "@/components/order/OrderCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { Order, useOrderStore } from "@/store/orderStore";
import { fadeInDown, fadeInDownDelay } from "@/constants/animations";

const { width } = Dimensions.get("window");

const QUICK_ACTIONS = [
  { icon: "navigation" as const, label: "Navigate", color: "#4A90E2", bg: "#EBF3FC", route: "/delivery/navigate" },
  { icon: "map" as const, label: "Heatmap", color: "#FF9A3D", bg: "#FFF5E6", route: "/(tabs)/map" },
  { icon: "alert-triangle" as const, label: "SOS", color: "#FF4D4F", bg: "#FFECEC", route: "/safety/sos" },
  { icon: "headphones" as const, label: "Support", color: "#34C759", bg: "#E8F9EC", route: "/support/" },
];

const STAT_CONFIG = [
  { label: "Rating", icon: "star" as const, colorKey: "accent", route: "/performance/ratings" },
  { label: "Acceptance", icon: "check-circle" as const, colorKey: "success", route: "/performance/analytics" },
  { label: "Completion", icon: "award" as const, colorKey: "accentPurple", route: "/performance/analytics" },
] as const;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function buildSimulatedOrder(): Order {
  return {
    id: `ord-sim-${Date.now()}`,
    orderNumber: `BRG-2024-${Math.floor(Math.random() * 900) + 100}`,
    status: "new",
    shop: {
      id: `shop-sim-${Date.now()}`,
      name: "Reliance Fresh",
      address: "14, HSR Layout, Sector 4, Bengaluru",
      phone: "+919876540001",
      lat: 12.9121,
      lng: 77.6446,
      type: "Grocery",
      distance: "0.5 km",
    },
    customer: {
      name: "Arjun Mehta",
      phone: "+919123400001",
      address: "Block B, Prestige Shantiniketan, Whitefield, Bengaluru",
      landmark: "Near ITPL Gate",
      lat: 12.9899,
      lng: 77.7478,
    },
    items: [
      { id: "si1", name: "Aashirvaad Atta", quantity: 1, price: 285, unit: "5kg" },
      { id: "si2", name: "Fortune Sunflower Oil", quantity: 1, price: 185, unit: "1L" },
      { id: "si3", name: "Maggi Noodles", quantity: 4, price: 14, unit: "70g each" },
    ],
    totalAmount: 526,
    deliveryFee: 70,
    distance: "1.7 km",
    estimatedTime: "20 min",
    paymentMode: "prepaid",
    priority: "standard",
    createdAt: new Date().toISOString(),
  };
}

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { agent, isOnline } = useAuthStore();
  const { earnings, acceptanceRate, completionRate, avgRating, shiftStartTime, totalHoursToday } = useAppStore();
  const { orders, acceptOrder, rejectOrder, addOrder } = useOrderStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [showSheet, setShowSheet] = React.useState(false);

  const shownOrderIdRef = useRef<string | null>(null);

  const incomingOrder = orders.find((o) => o.status === "new") ?? null;

  const activeOrders = orders.filter((o) =>
    ["accepted", "at_shop", "picked_up", "delivering"].includes(o.status)
  );
  const recentDelivered = orders.filter((o) => o.status === "delivered").slice(0, 3);

  useEffect(() => {
    if (incomingOrder && incomingOrder.id !== shownOrderIdRef.current) {
      shownOrderIdRef.current = incomingOrder.id;
      setShowSheet(true);
    }
    if (!incomingOrder) {
      shownOrderIdRef.current = null;
    }
  }, [incomingOrder?.id]);

  const handleAccept = () => {
    if (!incomingOrder) return;
    const shopId = incomingOrder.shop.id;
    acceptOrder(incomingOrder.id);
    setShowSheet(false);
    router.push(`/shop/${shopId}` as any);
  };

  const handleDecline = (_reason?: string) => {
    if (!incomingOrder) return;
    rejectOrder(incomingOrder.id);
    setShowSheet(false);
    shownOrderIdRef.current = null;
  };

  const handleSimulateOrder = () => {
    addOrder(buildSimulatedOrder());
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const shiftDuration = shiftStartTime
    ? Math.floor((Date.now() - new Date(shiftStartTime).getTime()) / 60000)
    : totalHoursToday * 60;

  const shiftHours = Math.floor(shiftDuration / 60);
  const shiftMins = shiftDuration % 60;

  const statValues = [
    avgRating.toFixed(2),
    `${acceptanceRate}%`,
    `${completionRate}%`,
  ];

  return (
    <>
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
        <Animated.View entering={fadeInDown(0)} style={styles.header}>
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
        <Animated.View entering={fadeInDownDelay(80)}>
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

        {/* ─── Demo: Simulate Incoming Order ─── */}
        {!incomingOrder && (
          <Animated.View entering={fadeInDownDelay(120)}>
            <Pressable
              onPress={handleSimulateOrder}
              style={({ pressed }) => [
                styles.simulateBanner,
                {
                  backgroundColor: colors.primaryLight,
                  borderColor: colors.primary + "40",
                  borderRadius: colors.radiusSm,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={[styles.simulateIcon, { backgroundColor: colors.primary + "20" }]}>
                <Feather name="bell" size={18} color={colors.primary} />
              </View>
              <View style={styles.simulateText}>
                <Text style={[styles.simulateTitle, { color: colors.primary }]}>
                  Simulate Incoming Order
                </Text>
                <Text style={[styles.simulateSub, { color: colors.primary + "99" }]}>
                  Tap to demo the order request flow
                </Text>
              </View>
              <Feather name="play" size={16} color={colors.primary} />
            </Pressable>
          </Animated.View>
        )}

        {/* ─── Earnings Hero ─── */}
        <Animated.View entering={fadeInDownDelay(150)}>
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

        {/* ─── Performance Stats (tappable shortcuts) ─── */}
        <Animated.View entering={fadeInDownDelay(220)} style={styles.statsRow}>
          {STAT_CONFIG.map((s, i) => {
            const color = (colors as any)[s.colorKey] as string;
            return (
              <Pressable
                key={s.label}
                onPress={() => router.push(s.route as any)}
                style={({ pressed }) => [styles.statPressable, { opacity: pressed ? 0.72 : 1 }]}
              >
                <Card style={styles.statCard} shadow>
                  <View style={[styles.statIcon, { backgroundColor: color + "18" }]}>
                    <Feather name={s.icon} size={16} color={color} />
                  </View>
                  <Text style={[styles.statValue, { color: colors.foreground }]}>{statValues[i]}</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
                  <Feather
                    name="chevron-right"
                    size={10}
                    color={colors.mutedForeground}
                    style={styles.statChevron}
                  />
                </Card>
              </Pressable>
            );
          })}
        </Animated.View>

        {/* ─── Quick Actions ─── */}
        <Animated.View entering={fadeInDownDelay(290)}>
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
          <Animated.View entering={fadeInDownDelay(360)}>
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
        <Animated.View entering={fadeInDownDelay(420)}>
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
        <Animated.View entering={fadeInDownDelay(480)}>
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
          <Animated.View entering={fadeInDownDelay(540)}>
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

      {/* ─── Incoming Order Request Sheet ─── */}
      <OrderRequestSheet
        visible={showSheet}
        order={incomingOrder}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </>
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
  simulateBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  simulateIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  simulateText: { flex: 1, gap: 2 },
  simulateTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  simulateSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
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
  statPressable: { flex: 1 },
  statCard: { gap: 8, alignItems: "flex-start", padding: 14, position: "relative" },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  statChevron: { position: "absolute", top: 14, right: 14 },
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
