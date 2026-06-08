import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";
import { fadeInDown, fadeInDownDelay } from "@/constants/animations";

const PERIODS = ["Week", "Month", "3 Months"] as const;

const WEEK_DATA = [
  { day: "Mon", orders: 12, earnings: 720 },
  { day: "Tue", orders: 8, earnings: 480 },
  { day: "Wed", orders: 15, earnings: 900 },
  { day: "Thu", orders: 11, earnings: 660 },
  { day: "Fri", orders: 18, earnings: 1080 },
  { day: "Sat", orders: 22, earnings: 1320 },
  { day: "Sun", orders: 14, earnings: 840 },
];

export default function AnalyticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { earnings, avgRating, acceptanceRate, completionRate } = useAppStore();
  const [period, setPeriod] = useState<typeof PERIODS[number]>("Week");

  const maxOrders = Math.max(...WEEK_DATA.map((d) => d.orders));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Analytics" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Toggle */}
        <Animated.View entering={fadeInDown(0)}>
          <View style={[styles.periodRow, { backgroundColor: colors.muted, borderRadius: 14 }]}>
            {PERIODS.map((p) => (
              <Pressable
                key={p}
                onPress={() => setPeriod(p)}
                style={[styles.periodChip, { backgroundColor: period === p ? colors.card : "transparent", borderRadius: 12 }]}
              >
                <Text style={[styles.periodText, { color: period === p ? colors.foreground : colors.mutedForeground }]}>{p}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Orders Chart */}
        <Animated.View entering={fadeInDownDelay(60)}>
          <Card>
            <Text style={[styles.chartTitle, { color: colors.foreground }]}>Orders per Day</Text>
            <View style={styles.chart}>
              {WEEK_DATA.map((d) => (
                <View key={d.day} style={styles.barCol}>
                  <Text style={[styles.barValue, { color: colors.foreground }]}>{d.orders}</Text>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          backgroundColor: colors.primary,
                          height: `${(d.orders / maxOrders) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDay, { color: colors.mutedForeground }]}>{d.day}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Earnings Chart */}
        <Animated.View entering={fadeInDownDelay(120)}>
          <Card>
            <Text style={[styles.chartTitle, { color: colors.foreground }]}>Daily Earnings (₹)</Text>
            <View style={styles.chart}>
              {WEEK_DATA.map((d) => {
                const maxE = Math.max(...WEEK_DATA.map((x) => x.earnings));
                return (
                  <View key={d.day} style={styles.barCol}>
                    <Text style={[styles.barValue, { color: colors.success, fontSize: 9 }]}>₹{d.earnings}</Text>
                    <View style={styles.barWrapper}>
                      <View
                        style={[
                          styles.bar,
                          { backgroundColor: colors.success, height: `${(d.earnings / maxE) * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={[styles.barDay, { color: colors.mutedForeground }]}>{d.day}</Text>
                  </View>
                );
              })}
            </View>
          </Card>
        </Animated.View>

        {/* KPIs */}
        <Animated.View entering={fadeInDownDelay(180)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Key Metrics</Text>
          <View style={styles.kpiGrid}>
            {[
              { label: "Avg Rating", value: avgRating.toFixed(2), icon: "star", color: "#FFB800" },
              { label: "Acceptance Rate", value: `${acceptanceRate}%`, icon: "check-circle", color: colors.success },
              { label: "Completion Rate", value: `${completionRate}%`, icon: "package", color: colors.primary },
              { label: "Avg Delivery", value: "22 min", icon: "clock", color: colors.info },
              { label: "Best Day", value: "Saturday", icon: "calendar", color: colors.accentPurple },
              { label: "Peak Hour", value: "7–9 PM", icon: "zap", color: colors.accent },
            ].map((k) => (
              <Card key={k.label} style={styles.kpiCard} shadow>
                <View style={[styles.kpiIcon, { backgroundColor: k.color + "18" }]}>
                  <Feather name={k.icon as any} size={16} color={k.color} />
                </View>
                <Text style={[styles.kpiValue, { color: colors.foreground }]}>{k.value}</Text>
                <Text style={[styles.kpiLabel, { color: colors.mutedForeground }]}>{k.label}</Text>
              </Card>
            ))}
          </View>
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
  chartTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 16 },
  chart: { flexDirection: "row", gap: 6, height: 140, alignItems: "flex-end" },
  barCol: { flex: 1, alignItems: "center", gap: 4, height: "100%" },
  barValue: { fontSize: 10, fontFamily: "Inter_700Bold" },
  barWrapper: { flex: 1, width: "100%", justifyContent: "flex-end" },
  bar: { width: "100%", borderRadius: 6 },
  barDay: { fontSize: 10, fontFamily: "Inter_500Medium" },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  kpiCard: { width: "47%", alignItems: "center", gap: 8, padding: 16 },
  kpiIcon: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  kpiValue: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  kpiLabel: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
});
