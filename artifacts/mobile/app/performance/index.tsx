import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";
import { fadeInDownDelay } from "@/constants/animations";

const PERF_MENU = [
  { icon: "star" as const, label: "Ratings & Reviews", sub: "Customer feedback", route: "/performance/ratings", color: "#FFB800" },
  { icon: "bar-chart-2" as const, label: "Analytics", sub: "Trends & insights", route: "/performance/analytics", color: "#4A90E2" },
  { icon: "award" as const, label: "Badges", sub: "Earned achievements", route: "/performance/badges", color: "#7C5CFF" },
  { icon: "gift" as const, label: "Rewards", sub: "Points & coupons", route: "/performance/rewards", color: "#FF9A3D" },
  { icon: "activity" as const, label: "Performance Score", sub: "Overall agent score", route: "/performance/score", color: "#34C759" },
];

export default function PerformanceScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { avgRating, acceptanceRate, completionRate, earnings, totalBadges } = useAppStore();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16), paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Performance</Text>

      {/* Score Card */}
      <Animated.View entering={fadeInDownDelay(50)}>
        <LinearGradient
          colors={["#1A1A2E", "#16213E"]}
          style={[styles.scoreCard, { borderRadius: colors.radius }]}
        >
          <View style={styles.scoreTop}>
            <View>
              <Text style={styles.scoreLabel}>Agent Score</Text>
              <Text style={styles.scoreValue}>92/100</Text>
            </View>
            <View style={[styles.rankBadge, { backgroundColor: "#FFB800" }]}>
              <Text style={styles.rankText}>🏆 Top 10%</Text>
            </View>
          </View>
          <View style={styles.scoreRow}>
            {[
              { label: "Rating", value: avgRating.toFixed(2), icon: "star" },
              { label: "Acceptance", value: `${acceptanceRate}%`, icon: "check-circle" },
              { label: "Completion", value: `${completionRate}%`, icon: "package" },
              { label: "Badges", value: totalBadges.toString(), icon: "award" },
            ].map((s, i) => (
              <View key={s.label} style={[styles.scoreItem, i > 0 && { borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.1)" }]}>
                <Text style={styles.scoreItemVal}>{s.value}</Text>
                <Text style={styles.scoreItemLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Menu */}
      <Animated.View entering={fadeInDownDelay(120)}>
        <Card padding={0}>
          {PERF_MENU.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={() => router.push(item.route as any)}
              style={({ pressed }) => [
                styles.menuRow,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: i < PERF_MENU.length - 1 ? 1 : 0,
                  backgroundColor: pressed ? colors.muted + "50" : "transparent",
                },
              ]}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + "18" }]}>
                <Feather name={item.icon} size={18} color={item.color} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </Card>
      </Animated.View>

      {/* Tips */}
      <Animated.View entering={fadeInDownDelay(180)}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Improve Your Score</Text>
        <View style={styles.tipsGrid}>
          {[
            { tip: "Accept more orders during peak hours", icon: "zap", color: "#FFB800" },
            { tip: "Communicate with customers proactively", icon: "message-circle", color: "#4A90E2" },
            { tip: "Complete deliveries before estimated time", icon: "clock", color: "#34C759" },
          ].map((t) => (
            <Card key={t.tip} style={styles.tipCard}>
              <View style={[styles.tipIcon, { backgroundColor: t.color + "18" }]}>
                <Feather name={t.icon as any} size={16} color={t.color} />
              </View>
              <Text style={[styles.tipText, { color: colors.foreground }]}>{t.tip}</Text>
            </Card>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 20 },
  pageTitle: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  scoreCard: { overflow: "hidden" },
  scoreTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 24,
    paddingBottom: 16,
  },
  scoreLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.7)", marginBottom: 4 },
  scoreValue: { fontSize: 48, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -2 },
  rankBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  rankText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#000" },
  scoreRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)", paddingVertical: 16, paddingHorizontal: 16 },
  scoreItem: { flex: 1, alignItems: "center", gap: 3 },
  scoreItemVal: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -0.5 },
  scoreItemLabel: { fontSize: 10, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  menuIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  menuText: { flex: 1, gap: 2 },
  menuLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  menuSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  tipsGrid: { gap: 10 },
  tipCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  tipIcon: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  tipText: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium", lineHeight: 20 },
});
