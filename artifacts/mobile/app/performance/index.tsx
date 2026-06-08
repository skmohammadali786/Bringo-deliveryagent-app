import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";

export default function PerformanceScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { avgRating, acceptanceRate, completionRate, totalBadges } = useAppStore();

  const metrics = [
    { label: "Overall Rating", value: avgRating.toString(), icon: "star", color: colors.accent, route: "/performance/ratings", badge: "Excellent" },
    { label: "Acceptance Rate", value: `${acceptanceRate}%`, icon: "check-circle", color: colors.success, route: "/performance/score", badge: "Good" },
    { label: "Completion Rate", value: `${completionRate}%`, icon: "package", color: colors.primary, route: "/performance/score", badge: "Excellent" },
    { label: "Badges Earned", value: totalBadges.toString(), icon: "award", color: colors.warning, route: "/performance/badges", badge: `${totalBadges} badges` },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Performance" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Animated.View entering={FadeInDown.delay(50).duration(500)} style={[styles.scoreBanner, { backgroundColor: colors.primary, borderRadius: colors.radius }]}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreLabel}>Performance Score</Text>
            <Text style={styles.scoreValue}>92/100</Text>
            <Badge label="Top 10% of agents" variant="default" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
          </View>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreGrade}>A+</Text>
          </View>
        </Animated.View>

        <View style={styles.metricsGrid}>
          {metrics.map((m, i) => (
            <Animated.View key={m.label} entering={FadeInDown.delay(100 + i * 60).duration(400)} style={styles.metricItem}>
              <Pressable onPress={() => router.push(m.route as any)} style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
                <View style={[styles.metricIcon, { backgroundColor: m.color + "18" }]}>
                  <Feather name={m.icon as any} size={22} color={m.color} />
                </View>
                <Text style={[styles.metricValue, { color: colors.foreground }]}>{m.value}</Text>
                <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{m.label}</Text>
                <Badge label={m.badge} variant="success" size="sm" />
              </Pressable>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(350).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Access</Text>
          {[
            { icon: "bar-chart-2", label: "Detailed Analytics", sub: "Weekly & monthly trends", route: "/performance/analytics" },
            { icon: "award", label: "Badges & Achievements", sub: `${totalBadges} badges unlocked`, route: "/performance/badges" },
            { icon: "gift", label: "Rewards Program", sub: "Redeem your points", route: "/performance/rewards" },
          ].map((item, i) => (
            <Pressable key={item.label} onPress={() => router.push(item.route as any)} style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm, marginBottom: 10 }]}>
              <View style={[styles.menuIcon, { backgroundColor: colors.muted }]}>
                <Feather name={item.icon as any} size={18} color={colors.foreground} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  scoreBanner: { padding: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  scoreLeft: { gap: 8 },
  scoreLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.8)" },
  scoreValue: { fontSize: 44, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -1.5 },
  scoreCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  scoreGrade: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#FFF" },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metricItem: { width: "47%" },
  metricCard: { padding: 16, gap: 8, borderWidth: 1 },
  metricIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  metricValue: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  metricLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4, marginBottom: 4 },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderWidth: 1 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  menuText: { flex: 1, gap: 2 },
  menuLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  menuSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
