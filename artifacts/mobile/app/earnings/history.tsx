import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDown, fadeInDownDelay } from "@/constants/animations";

const RAW_HISTORY = [
  { id: "1",  daysAgo: 0,  date: "Today, Jun 8",     orders: 7,  base: 620,  tips: 80,  incentives: 200, total: 900  },
  { id: "2",  daysAgo: 1,  date: "Yesterday, Jun 7",  orders: 9,  base: 810,  tips: 120, incentives: 300, total: 1230 },
  { id: "3",  daysAgo: 2,  date: "Sat, Jun 6",        orders: 6,  base: 540,  tips: 60,  incentives: 150, total: 750  },
  { id: "4",  daysAgo: 3,  date: "Fri, Jun 5",        orders: 11, base: 990,  tips: 150, incentives: 400, total: 1540 },
  { id: "5",  daysAgo: 4,  date: "Thu, Jun 4",        orders: 13, base: 1170, tips: 200, incentives: 500, total: 1870 },
  { id: "6",  daysAgo: 5,  date: "Wed, Jun 3",        orders: 8,  base: 720,  tips: 100, incentives: 200, total: 1020 },
  { id: "7",  daysAgo: 6,  date: "Tue, Jun 2",        orders: 5,  base: 450,  tips: 50,  incentives: 100, total: 600  },
  { id: "8",  daysAgo: 8,  date: "Sun, Jun 1",        orders: 12, base: 1080, tips: 160, incentives: 350, total: 1590 },
  { id: "9",  daysAgo: 11, date: "Thu, May 29",       orders: 15, base: 1350, tips: 220, incentives: 500, total: 2070 },
  { id: "10", daysAgo: 15, date: "Sun, May 25",       orders: 7,  base: 630,  tips: 90,  incentives: 200, total: 920  },
  { id: "11", daysAgo: 22, date: "Sun, May 18",       orders: 10, base: 900,  tips: 130, incentives: 300, total: 1330 },
  { id: "12", daysAgo: 28, date: "Mon, May 12",       orders: 8,  base: 720,  tips: 95,  incentives: 210, total: 1025 },
  { id: "13", daysAgo: 36, date: "Sun, May 4",        orders: 11, base: 990,  tips: 140, incentives: 380, total: 1510 },
  { id: "14", daysAgo: 50, date: "Sun, Apr 20",       orders: 14, base: 1260, tips: 210, incentives: 520, total: 1990 },
  { id: "15", daysAgo: 65, date: "Sat, Apr 5",        orders: 9,  base: 810,  tips: 120, incentives: 300, total: 1230 },
  { id: "16", daysAgo: 80, date: "Fri, Mar 21",       orders: 7,  base: 630,  tips: 85,  incentives: 190, total: 905  },
];

const PERIODS = ["Week", "Month", "3 Months"] as const;
const PERIOD_DAYS: Record<typeof PERIODS[number], number> = { Week: 7, Month: 30, "3 Months": 91 };

export default function EarningsHistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<typeof PERIODS[number]>("Week");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredHistory = useMemo(
    () => RAW_HISTORY.filter((h) => h.daysAgo < PERIOD_DAYS[period]),
    [period]
  );

  const totalEarnings = filteredHistory.reduce((s, h) => s + h.total, 0);
  const totalOrders = filteredHistory.reduce((s, h) => s + h.orders, 0);
  const avgPerDay = filteredHistory.length > 0 ? Math.floor(totalEarnings / filteredHistory.length) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Earnings History" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector */}
        <Animated.View entering={fadeInDown(0)}>
          <View style={[styles.periodRow, { backgroundColor: colors.muted, borderRadius: 14 }]}>
            {PERIODS.map((p) => (
              <Pressable
                key={p}
                onPress={() => { setPeriod(p); setExpanded(null); }}
                style={[
                  styles.periodChip,
                  { backgroundColor: period === p ? colors.card : "transparent", borderRadius: 12 },
                ]}
              >
                <Text style={[styles.periodText, { color: period === p ? colors.foreground : colors.mutedForeground }]}>
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Summary */}
        <Animated.View entering={fadeInDownDelay(60)}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryLeft}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Total Earnings</Text>
              <View style={styles.totalRow}>
                <MaterialCommunityIcons name="currency-inr" size={24} color={colors.success} />
                <Text style={[styles.totalAmount, { color: colors.success }]}>
                  {totalEarnings.toLocaleString("en-IN")}
                </Text>
              </View>
              <Text style={[styles.summaryOrders, { color: colors.mutedForeground }]}>
                {totalOrders} deliveries · {filteredHistory.length} days
              </Text>
            </View>
            <View style={styles.summaryRight}>
              <View style={[styles.avgCard, { backgroundColor: colors.successLight }]}>
                <Text style={[styles.avgLabel, { color: colors.mutedForeground }]}>Avg / Day</Text>
                <Text style={[styles.avgValue, { color: colors.success }]}>
                  ₹{avgPerDay.toLocaleString("en-IN")}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Daily Breakdown */}
        <Animated.View entering={fadeInDownDelay(120)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Daily Breakdown</Text>
          {filteredHistory.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Feather name="calendar" size={32} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No data for this period</Text>
            </Card>
          ) : (
            <Card padding={0}>
              {filteredHistory.map((h, i) => (
                <View key={h.id}>
                  <Pressable
                    onPress={() => setExpanded((e) => e === h.id ? null : h.id)}
                    style={[
                      styles.historyRow,
                      {
                        borderBottomColor: colors.border,
                        borderBottomWidth: expanded === h.id || i < filteredHistory.length - 1 ? 1 : 0,
                      },
                    ]}
                  >
                    <View style={styles.historyLeft}>
                      <Text style={[styles.historyDate, { color: colors.foreground }]}>{h.date}</Text>
                      <Text style={[styles.historyOrders, { color: colors.mutedForeground }]}>
                        {h.orders} orders
                      </Text>
                    </View>
                    <Text style={[styles.historyTotal, { color: colors.success }]}>
                      ₹{h.total.toLocaleString("en-IN")}
                    </Text>
                    <Feather
                      name={expanded === h.id ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={colors.mutedForeground}
                    />
                  </Pressable>
                  {expanded === h.id && (
                    <View
                      style={[
                        styles.breakdown,
                        {
                          backgroundColor: colors.muted + "50",
                          borderBottomColor: colors.border,
                          borderBottomWidth: i < filteredHistory.length - 1 ? 1 : 0,
                        },
                      ]}
                    >
                      {[
                        { label: "Base Earnings", value: `₹${h.base.toLocaleString("en-IN")}`, color: colors.foreground },
                        { label: "Tips",          value: `₹${h.tips.toLocaleString("en-IN")}`, color: colors.success },
                        { label: "Incentives",    value: `₹${h.incentives.toLocaleString("en-IN")}`, color: colors.accentPurple },
                      ].map((row) => (
                        <View key={row.label} style={styles.breakdownRow}>
                          <Text style={[styles.breakdownLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
                          <Text style={[styles.breakdownValue, { color: row.color }]}>{row.value}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </Card>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  periodRow: { flexDirection: "row", padding: 4 },
  periodChip: { flex: 1, alignItems: "center", paddingVertical: 10 },
  periodText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  summaryCard: { flexDirection: "row", alignItems: "center" },
  summaryLeft: { flex: 1, gap: 4 },
  summaryLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  totalRow: { flexDirection: "row", alignItems: "center" },
  totalAmount: { fontSize: 36, fontFamily: "Inter_700Bold", letterSpacing: -1.5 },
  summaryOrders: { fontSize: 13, fontFamily: "Inter_400Regular" },
  summaryRight: {},
  avgCard: { padding: 14, borderRadius: 16, alignItems: "center", gap: 4 },
  avgLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  avgValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  historyRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  historyLeft: { flex: 1, gap: 2 },
  historyDate: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  historyOrders: { fontSize: 12, fontFamily: "Inter_400Regular" },
  historyTotal: { fontSize: 17, fontFamily: "Inter_700Bold" },
  breakdown: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  breakdownRow: { flexDirection: "row", justifyContent: "space-between" },
  breakdownLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  breakdownValue: { fontSize: 13, fontFamily: "Inter_700Bold" },
  emptyCard: { alignItems: "center", gap: 12, paddingVertical: 32 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
