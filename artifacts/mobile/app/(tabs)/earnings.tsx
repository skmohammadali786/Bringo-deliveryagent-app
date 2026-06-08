import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";
import { fadeInDownDelay } from "@/constants/animations";

type Period = "Today" | "Week" | "Month";

const { width } = Dimensions.get("window");

const TRANSACTIONS = [
  { id: "1", type: "delivery", label: "Order BRG-2024-003", sub: "Quick Bites Restaurant", amount: 65, date: "2h ago", icon: "package" },
  { id: "2", type: "bonus", label: "Peak Hour Bonus", sub: "12 PM – 2 PM slot", amount: 100, date: "4h ago", icon: "zap" },
  { id: "3", type: "delivery", label: "Order BRG-2024-002", sub: "FreshKart Vegetables", amount: 40, date: "6h ago", icon: "package" },
  { id: "4", type: "incentive", label: "5-Order Incentive", sub: "Daily target completed", amount: 200, date: "Yesterday", icon: "award" },
  { id: "5", type: "delivery", label: "Order BRG-2024-001", sub: "Green Mart Superstore", amount: 55, date: "Yesterday", icon: "package" },
  { id: "6", type: "payout", label: "Bank Transfer", sub: "HDFC •••1234", amount: -2340, date: "3 days ago", icon: "credit-card" },
];

const WEEK_BARS = [
  { day: "Mon", amount: 620 },
  { day: "Tue", amount: 840 },
  { day: "Wed", amount: 450 },
  { day: "Thu", amount: 920 },
  { day: "Fri", amount: 760 },
  { day: "Sat", amount: 1100 },
  { day: "Sun", amount: 540 },
];

const maxBar = Math.max(...WEEK_BARS.map((b) => b.amount));

export default function EarningsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { earnings } = useAppStore();
  const [period, setPeriod] = useState<Period>("Today");

  const mainValue = period === "Today" ? earnings.today : period === "Week" ? earnings.week : earnings.month;
  const mainOrders = period === "Today" ? earnings.todayOrders : period === "Week" ? earnings.weekOrders : earnings.monthOrders;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16), paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Earnings</Text>

      {/* Period Picker */}
      <View style={[styles.periodPicker, { backgroundColor: colors.muted, borderRadius: 20 }]}>
        {(["Today", "Week", "Month"] as Period[]).map((p) => (
          <Pressable
            key={p}
            onPress={() => setPeriod(p)}
            style={[
              styles.periodBtn,
              period === p && {
                backgroundColor: colors.card,
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              },
            ]}
          >
            <Text style={[styles.periodText, { color: period === p ? colors.foreground : colors.mutedForeground }]}>
              {p}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Main Earnings Card */}
      <Animated.View entering={fadeInDownDelay(80)}>
        <LinearGradient
          colors={["#1A1A2E", "#16213E"]}
          style={[styles.mainCard, { borderRadius: colors.radius }]}
        >
          <View style={styles.mainTop}>
            <Text style={styles.mainLabel}>Total Earnings</Text>
            <View style={[styles.periodBadge, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
              <Text style={styles.periodBadgeText}>{period}</Text>
            </View>
          </View>
          <View style={styles.mainAmountRow}>
            <Text style={styles.mainCurrency}>₹</Text>
            <Text style={styles.mainAmount}>{mainValue.toLocaleString("en-IN")}</Text>
          </View>
          <View style={[styles.mainStatsRow, { borderTopColor: "rgba(255,255,255,0.1)" }]}>
            {[
              { label: "Deliveries", value: mainOrders.toString() },
              { label: "Incentives", value: `₹${earnings.incentives}` },
              { label: "Bonuses", value: `₹${earnings.bonuses}` },
            ].map((s, i) => (
              <View key={s.label} style={[styles.mainStat, i > 0 && { borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.1)" }]}>
                <Text style={styles.mainStatVal}>{s.value}</Text>
                <Text style={styles.mainStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View entering={fadeInDownDelay(150)} style={styles.actionRow}>
        <Pressable
          onPress={() => router.push("/earnings/withdraw" as any)}
          style={[styles.primaryAction, { backgroundColor: colors.primary, borderRadius: colors.radiusSm }]}
        >
          <Feather name="arrow-up-right" size={18} color="#FFF" />
          <Text style={styles.primaryActionText}>Withdraw</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/earnings/history" as any)}
          style={[styles.secondaryAction, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}
        >
          <Feather name="clock" size={18} color={colors.foreground} />
          <Text style={[styles.secondaryActionText, { color: colors.foreground }]}>History</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/earnings/incentives" as any)}
          style={[styles.secondaryAction, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}
        >
          <Feather name="gift" size={18} color={colors.foreground} />
          <Text style={[styles.secondaryActionText, { color: colors.foreground }]}>Incentives</Text>
        </Pressable>
      </Animated.View>

      {/* Weekly Chart */}
      <Animated.View entering={fadeInDownDelay(200)}>
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.foreground }]}>Weekly Breakdown</Text>
            <Text style={[styles.chartSub, { color: colors.mutedForeground }]}>
              ₹{earnings.week.toLocaleString("en-IN")} this week
            </Text>
          </View>
          <View style={styles.barsRow}>
            {WEEK_BARS.map((b, i) => {
              const isToday = i === new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
              const height = Math.max((b.amount / maxBar) * 100, 8);
              return (
                <View key={b.day} style={styles.barCol}>
                  <Text style={[styles.barAmount, { color: colors.mutedForeground }]}>
                    {b.amount >= 1000 ? `${(b.amount / 1000).toFixed(1)}k` : b.amount}
                  </Text>
                  <View style={[styles.barBg, { backgroundColor: colors.muted }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${height}%`,
                          backgroundColor: i === 5 ? colors.primary : colors.accentPurple + "80",
                          borderRadius: 6,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDay, { color: i === 5 ? colors.primary : colors.mutedForeground }]}>
                    {b.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      </Animated.View>

      {/* Active Incentive */}
      <Animated.View entering={fadeInDownDelay(260)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Active Incentive</Text>
          <Pressable onPress={() => router.push("/earnings/incentives" as any)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>View all</Text>
          </Pressable>
        </View>
        <Card style={styles.incentiveCard}>
          <View style={styles.incentiveTop}>
            <View style={[styles.incentiveIconWrap, { backgroundColor: colors.accentLight }]}>
              <Feather name="zap" size={22} color={colors.accent} />
            </View>
            <View style={styles.incentiveInfo}>
              <Text style={[styles.incentiveTitle, { color: colors.foreground }]}>
                Complete 5 more orders today
              </Text>
              <Text style={[styles.incentiveSub, { color: colors.mutedForeground }]}>
                Earn ₹200 bonus reward
              </Text>
            </View>
            <View style={[styles.incentiveBadge, { backgroundColor: colors.accentLight }]}>
              <Text style={[styles.incentiveBadgeText, { color: colors.accent }]}>₹200</Text>
            </View>
          </View>
          <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.accent, width: "60%" }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>3 of 5 completed</Text>
            <Text style={[styles.progressPct, { color: colors.accent }]}>60%</Text>
          </View>
        </Card>
      </Animated.View>

      {/* Recent Transactions */}
      <Animated.View entering={fadeInDownDelay(320)}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Transactions</Text>
        <Card padding={0}>
          {TRANSACTIONS.map((t, i) => (
            <View
              key={t.id}
              style={[
                styles.txRow,
                { borderBottomColor: colors.border, borderBottomWidth: i < TRANSACTIONS.length - 1 ? 1 : 0 },
              ]}
            >
              <View
                style={[
                  styles.txIconWrap,
                  {
                    backgroundColor:
                      t.type === "delivery"
                        ? colors.primaryLight
                        : t.type === "bonus"
                        ? colors.accentLight
                        : t.type === "payout"
                        ? colors.muted
                        : colors.successLight,
                  },
                ]}
              >
                <Feather
                  name={t.icon as any}
                  size={16}
                  color={
                    t.type === "delivery"
                      ? colors.primary
                      : t.type === "bonus"
                      ? colors.accent
                      : t.type === "payout"
                      ? colors.mutedForeground
                      : colors.success
                  }
                />
              </View>
              <View style={styles.txInfo}>
                <Text style={[styles.txLabel, { color: colors.foreground }]}>{t.label}</Text>
                <Text style={[styles.txSub, { color: colors.mutedForeground }]}>{t.sub} · {t.date}</Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  { color: t.amount < 0 ? colors.destructive : colors.success },
                ]}
              >
                {t.amount < 0 ? `-₹${Math.abs(t.amount)}` : `+₹${t.amount}`}
              </Text>
            </View>
          ))}
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 20 },
  pageTitle: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  periodPicker: { flexDirection: "row", padding: 4 },
  periodBtn: { flex: 1, paddingVertical: 9, alignItems: "center" },
  periodText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  mainCard: { padding: 0, overflow: "hidden" },
  mainTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  mainLabel: { fontSize: 14, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.7)" },
  periodBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  periodBadgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.9)" },
  mainAmountRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 4,
  },
  mainCurrency: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#FFB800",
    marginTop: 8,
  },
  mainAmount: {
    fontSize: 52,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: -2,
    lineHeight: 58,
  },
  mainStatsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  mainStat: { flex: 1, alignItems: "center", gap: 4, paddingHorizontal: 8 },
  mainStatVal: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -0.4 },
  mainStatLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  actionRow: { flexDirection: "row", gap: 10 },
  primaryAction: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
  },
  primaryActionText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#FFF" },
  secondaryAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 15,
    borderWidth: 1,
  },
  secondaryActionText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  chartCard: { gap: 16 },
  chartHeader: { gap: 2 },
  chartTitle: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  chartSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  barsRow: { flexDirection: "row", alignItems: "flex-end", gap: 4, height: 120 },
  barCol: { flex: 1, alignItems: "center", height: "100%", justifyContent: "flex-end", gap: 4 },
  barAmount: { fontSize: 9, fontFamily: "Inter_500Medium" },
  barBg: { width: "100%", flex: 1, borderRadius: 6, justifyContent: "flex-end", overflow: "hidden" },
  barFill: { width: "100%" },
  barDay: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  incentiveCard: { gap: 14 },
  incentiveTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  incentiveIconWrap: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  incentiveInfo: { flex: 1, gap: 2 },
  incentiveTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  incentiveSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  incentiveBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  incentiveBadgeText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  progressBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  progressLabels: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  progressPct: { fontSize: 12, fontFamily: "Inter_700Bold" },
  txRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  txIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txInfo: { flex: 1, gap: 2 },
  txLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  txSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  txAmount: { fontSize: 15, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
});
