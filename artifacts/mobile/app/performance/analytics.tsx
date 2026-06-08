import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const WEEKLY_DATA = [
  { day: "Mon", orders: 8, earnings: 560 },
  { day: "Tue", orders: 12, earnings: 840 },
  { day: "Wed", orders: 6, earnings: 420 },
  { day: "Thu", orders: 15, earnings: 1050 },
  { day: "Fri", orders: 18, earnings: 1260 },
  { day: "Sat", orders: 22, earnings: 1540 },
  { day: "Sun", orders: 11, earnings: 770 },
];

const maxOrders = Math.max(...WEEKLY_DATA.map((d) => d.orders));

export default function AnalyticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const totalOrders = WEEKLY_DATA.reduce((s, d) => s + d.orders, 0);
  const totalEarnings = WEEKLY_DATA.reduce((s, d) => s + d.earnings, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Analytics" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Text style={[styles.summaryVal, { color: colors.foreground }]}>{totalOrders}</Text>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>This Week</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={[styles.summaryVal, { color: colors.success }]}>₹{totalEarnings.toLocaleString()}</Text>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Week Earnings</Text>
          </Card>
        </View>

        <Card>
          <Text style={[styles.chartTitle, { color: colors.foreground }]}>Daily Orders — This Week</Text>
          <View style={styles.chart}>
            {WEEKLY_DATA.map((d) => (
              <View key={d.day} style={styles.barGroup}>
                <Text style={[styles.barVal, { color: colors.mutedForeground }]}>{d.orders}</Text>
                <View style={styles.barContainer}>
                  <View style={[styles.bar, { backgroundColor: colors.primary, height: `${(d.orders / maxOrders) * 100}%`, borderRadius: 6 }]} />
                </View>
                <Text style={[styles.barDay, { color: colors.mutedForeground }]}>{d.day}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={[styles.chartTitle, { color: colors.foreground }]}>Best Performance Days</Text>
          {WEEKLY_DATA.sort((a, b) => b.earnings - a.earnings).slice(0, 3).map((d, i) => (
            <View key={d.day} style={[styles.topDay, { borderBottomColor: colors.border, borderBottomWidth: i < 2 ? 1 : 0 }]}>
              <View style={[styles.topRank, { backgroundColor: i === 0 ? colors.accentLight : colors.muted }]}>
                <Text style={[styles.topRankText, { color: i === 0 ? colors.accent : colors.mutedForeground }]}>#{i + 1}</Text>
              </View>
              <Text style={[styles.topDay_, { color: colors.foreground }]}>{d.day}urday</Text>
              <Text style={[styles.topOrders, { color: colors.mutedForeground }]}>{d.orders} orders</Text>
              <Text style={[styles.topEarnings, { color: colors.success }]}>₹{d.earnings}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  summaryRow: { flexDirection: "row", gap: 12 },
  summaryCard: { flex: 1, alignItems: "center", gap: 4 },
  summaryVal: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  summaryLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  chartTitle: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: -0.3, marginBottom: 16 },
  chart: { flexDirection: "row", height: 140, alignItems: "flex-end", gap: 8 },
  barGroup: { flex: 1, alignItems: "center", gap: 4 },
  barVal: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  barContainer: { flex: 1, width: "100%", justifyContent: "flex-end" },
  bar: { width: "100%" },
  barDay: { fontSize: 10, fontFamily: "Inter_500Medium" },
  topDay: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 },
  topRank: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  topRankText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  topDay_: { flex: 1, fontSize: 15, fontFamily: "Inter_600SemiBold" },
  topOrders: { fontSize: 13, fontFamily: "Inter_400Regular" },
  topEarnings: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
