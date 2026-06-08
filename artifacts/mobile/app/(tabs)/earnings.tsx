import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";

const PERIOD = ["Today", "Week", "Month"] as const;
type PeriodKey = typeof PERIOD[number];

const TRANSACTIONS = [
  { id: "1", type: "delivery", label: "Order BRG-2024-003", amount: 50, date: "2h ago", icon: "package" },
  { id: "2", type: "bonus", label: "Peak Hour Bonus", amount: 100, date: "4h ago", icon: "zap" },
  { id: "3", type: "delivery", label: "Order BRG-2024-002", amount: 30, date: "6h ago", icon: "package" },
  { id: "4", type: "incentive", label: "5-Order Incentive", amount: 200, date: "Yesterday", icon: "award" },
  { id: "5", type: "delivery", label: "Order BRG-2024-001", amount: 35, date: "Yesterday", icon: "package" },
];

export default function EarningsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { earnings } = useAppStore();
  const [period, setPeriod] = useState<PeriodKey>("Today");

  const getValue = () => {
    if (period === "Today") return earnings.today;
    if (period === "Week") return earnings.week;
    return earnings.month;
  };

  const getOrders = () => {
    if (period === "Today") return earnings.todayOrders;
    if (period === "Week") return earnings.weekOrders;
    return earnings.monthOrders;
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16), paddingBottom: insets.bottom + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Earnings</Text>

      {/* Period Selector */}
      <View style={[styles.periodRow, { backgroundColor: colors.muted, borderRadius: 20 }]}>
        {PERIOD.map((p) => (
          <Pressable
            key={p}
            onPress={() => setPeriod(p)}
            style={[styles.periodBtn, { backgroundColor: period === p ? colors.card : "transparent", borderRadius: 18, shadowColor: period === p ? "#000" : "transparent", shadowOpacity: 0.08, shadowRadius: 4, elevation: period === p ? 2 : 0 }]}
          >
            <Text style={[styles.periodLabel, { color: period === p ? colors.foreground : colors.mutedForeground }]}>{p}</Text>
          </Pressable>
        ))}
      </View>

      {/* Main Earning Card */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)}>
        <LinearGradient colors={["#1C1C1E", "#2C2C2E"]} style={[styles.mainCard, { borderRadius: colors.radius }]}>
          <Text style={styles.mainLabel}>Total Earnings</Text>
          <View style={styles.mainRow}>
            <MaterialCommunityIcons name="currency-inr" size={28} color="#FFB800" />
            <Text style={styles.mainValue}>{getValue().toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.mainStats}>
            <View style={styles.mainStat}>
              <Text style={styles.mainStatVal}>{getOrders()}</Text>
              <Text style={styles.mainStatLabel}>Deliveries</Text>
            </View>
            <View style={[styles.mainStatDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
            <View style={styles.mainStat}>
              <Text style={styles.mainStatVal}>₹{earnings.incentives}</Text>
              <Text style={styles.mainStatLabel}>Incentives</Text>
            </View>
            <View style={[styles.mainStatDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
            <View style={styles.mainStat}>
              <Text style={styles.mainStatVal}>₹{earnings.bonuses}</Text>
              <Text style={styles.mainStatLabel}>Bonuses</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Actions */}
      <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.actions}>
        <Pressable
          onPress={() => router.push("/earnings/withdraw" as any)}
          style={[styles.actionBtn, { backgroundColor: colors.primary, borderRadius: colors.radiusSm }]}
        >
          <Feather name="arrow-up-right" size={20} color="#FFF" />
          <Text style={styles.actionBtnText}>Withdraw</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/earnings/history" as any)}
          style={[styles.actionBtnOutline, { borderColor: colors.border, borderRadius: colors.radiusSm, backgroundColor: colors.card }]}
        >
          <Feather name="clock" size={20} color={colors.foreground} />
          <Text style={[styles.actionBtnOutlineText, { color: colors.foreground }]}>History</Text>
        </Pressable>
      </Animated.View>

      {/* Incentives */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Active Incentives</Text>
          <Pressable onPress={() => router.push("/earnings/incentives" as any)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>View all</Text>
          </Pressable>
        </View>
        <Card>
          <View style={styles.incentiveRow}>
            <View style={[styles.incentiveIcon, { backgroundColor: colors.accentLight }]}>
              <Feather name="award" size={20} color={colors.accent} />
            </View>
            <View style={styles.incentiveText}>
              <Text style={[styles.incentiveTitle, { color: colors.foreground }]}>Complete 5 more orders today</Text>
              <Text style={[styles.incentiveSub, { color: colors.mutedForeground }]}>Earn ₹200 bonus reward</Text>
            </View>
            <Badge label="₹200" variant="accent" />
          </View>
          <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.accent, width: "60%" }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.mutedForeground }]}>3/5 completed</Text>
        </Card>
      </Animated.View>

      {/* Recent Transactions */}
      <Animated.View entering={FadeInDown.delay(250).duration(500)}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Transactions</Text>
        <Card padding={0}>
          {TRANSACTIONS.map((t, i) => (
            <View
              key={t.id}
              style={[styles.txRow, { borderBottomColor: colors.border, borderBottomWidth: i < TRANSACTIONS.length - 1 ? 1 : 0 }]}
            >
              <View style={[styles.txIcon, { backgroundColor: t.type === "delivery" ? colors.primaryLight : t.type === "bonus" ? colors.accentLight : colors.successLight }]}>
                <Feather name={t.icon as any} size={16} color={t.type === "delivery" ? colors.primary : t.type === "bonus" ? colors.accent : colors.success} />
              </View>
              <View style={styles.txText}>
                <Text style={[styles.txLabel, { color: colors.foreground }]}>{t.label}</Text>
                <Text style={[styles.txDate, { color: colors.mutedForeground }]}>{t.date}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, { color: colors.success }]}>+₹{t.amount}</Text>
              </View>
            </View>
          ))}
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 20 },
  pageTitle: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  periodRow: { flexDirection: "row", padding: 4, gap: 0 },
  periodBtn: { flex: 1, paddingVertical: 8, alignItems: "center" },
  periodLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  mainCard: { padding: 24, gap: 20 },
  mainLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.7)" },
  mainRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  mainValue: { fontSize: 44, fontFamily: "Inter_700Bold", color: "#FFFFFF", letterSpacing: -1.5 },
  mainStats: { flexDirection: "row", alignItems: "center", gap: 16 },
  mainStat: { flex: 1, alignItems: "center", gap: 4 },
  mainStatVal: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFFFFF", letterSpacing: -0.4 },
  mainStatLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  mainStatDivider: { width: 1, height: 32 },
  actions: { flexDirection: "row", gap: 12 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14 },
  actionBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFF" },
  actionBtnOutline: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderWidth: 1 },
  actionBtnOutlineText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  incentiveRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  incentiveIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  incentiveText: { flex: 1, gap: 2 },
  incentiveTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  incentiveSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  progressBg: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  progressText: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 6 },
  txRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  txText: { flex: 1, gap: 2 },
  txLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  txDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  txRight: {},
  txAmount: { fontSize: 15, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
});
