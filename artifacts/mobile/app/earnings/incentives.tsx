import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDown, fadeInDownDelay, fadeInDownIndexed } from "@/constants/animations";

const ACTIVE_INCENTIVES = [
  {
    id: "1",
    title: "Peak Hours Bonus",
    desc: "Earn ₹50 extra per order between 7–9 PM",
    icon: "zap",
    color: "#FFB800",
    progress: 3,
    target: 5,
    reward: "₹150",
    expires: "Today 9 PM",
    active: true,
  },
  {
    id: "2",
    title: "Weekend Warrior",
    desc: "Complete 15 orders this weekend for ₹500 bonus",
    icon: "sun",
    color: "#FF6B35",
    progress: 9,
    target: 15,
    reward: "₹500",
    expires: "Sun 11:59 PM",
    active: true,
  },
  {
    id: "3",
    title: "5-Star Streak",
    desc: "Get 10 consecutive 5-star ratings",
    icon: "star",
    color: "#FFB800",
    progress: 7,
    target: 10,
    reward: "₹200",
    expires: "Ongoing",
    active: true,
  },
];

const UPCOMING_INCENTIVES = [
  { id: "4", title: "Monday Surge", desc: "3× earnings on Mondays 8–10 AM", icon: "trending-up", color: "#7C5CFF", reward: "+3×", starts: "Mon 8 AM" },
  { id: "5", title: "New Area Bonus", desc: "Extra ₹30 per order in Electronic City", icon: "map-pin", color: "#4A90E2", reward: "+₹30/order", starts: "Jun 15" },
];

export default function IncentivesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Incentives & Bonuses" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <Animated.View entering={fadeInDown(0)}>
          <Card style={[styles.summaryCard, { backgroundColor: "#1A1A2E" }]}>
            <Text style={styles.summaryHeading}>Potential Today</Text>
            <Text style={styles.summaryValue}>₹850</Text>
            <Text style={styles.summarySub}>In active incentive rewards</Text>
          </Card>
        </Animated.View>

        {/* Active Incentives */}
        <Animated.View entering={fadeInDownDelay(80)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Active Incentives</Text>
            <View style={[styles.activeBadge, { backgroundColor: colors.successLight }]}>
              <View style={[styles.activeDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.activeText, { color: colors.success }]}>Live</Text>
            </View>
          </View>
          {ACTIVE_INCENTIVES.map((inc, i) => (
            <Animated.View key={inc.id} entering={fadeInDownIndexed(100, i)}>
              <Card style={styles.incentiveCard}>
                <View style={styles.incTop}>
                  <View style={[styles.incIcon, { backgroundColor: inc.color + "18" }]}>
                    <Feather name={inc.icon as any} size={22} color={inc.color} />
                  </View>
                  <View style={styles.incInfo}>
                    <Text style={[styles.incTitle, { color: colors.foreground }]}>{inc.title}</Text>
                    <Text style={[styles.incDesc, { color: colors.mutedForeground }]}>{inc.desc}</Text>
                  </View>
                  <View style={[styles.rewardBadge, { backgroundColor: inc.color + "18" }]}>
                    <Text style={[styles.rewardText, { color: inc.color }]}>{inc.reward}</Text>
                  </View>
                </View>
                <View style={styles.incProgress}>
                  <View style={[styles.progressBarBg, { backgroundColor: colors.muted }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { backgroundColor: inc.color, width: `${(inc.progress / inc.target) * 100}%` },
                      ]}
                    />
                  </View>
                  <View style={styles.progressMeta}>
                    <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
                      {inc.progress}/{inc.target} completed
                    </Text>
                    <Text style={[styles.expiresText, { color: colors.mutedForeground }]}>Expires: {inc.expires}</Text>
                  </View>
                </View>
              </Card>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Upcoming */}
        <Animated.View entering={fadeInDownDelay(300)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Upcoming Incentives</Text>
          <Card padding={0}>
            {UPCOMING_INCENTIVES.map((inc, i) => (
              <View
                key={inc.id}
                style={[styles.upcomingRow, { borderBottomColor: colors.border, borderBottomWidth: i < UPCOMING_INCENTIVES.length - 1 ? 1 : 0 }]}
              >
                <View style={[styles.upcomingIcon, { backgroundColor: inc.color + "14" }]}>
                  <Feather name={inc.icon as any} size={18} color={inc.color} />
                </View>
                <View style={styles.upcomingInfo}>
                  <Text style={[styles.upcomingTitle, { color: colors.foreground }]}>{inc.title}</Text>
                  <Text style={[styles.upcomingDesc, { color: colors.mutedForeground }]}>{inc.desc}</Text>
                  <Text style={[styles.upcomingStarts, { color: colors.primary }]}>Starts: {inc.starts}</Text>
                </View>
                <Text style={[styles.upcomingReward, { color: inc.color }]}>{inc.reward}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  summaryCard: { alignItems: "center", gap: 6 },
  summaryHeading: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  summaryValue: { fontSize: 44, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -2 },
  summarySub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  activeBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  activeDot: { width: 7, height: 7, borderRadius: 3.5 },
  activeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  incentiveCard: { gap: 12 },
  incTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  incIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", marginTop: 2 },
  incInfo: { flex: 1, gap: 3 },
  incTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  incDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  rewardBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  rewardText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  incProgress: { gap: 8 },
  progressBarBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 4 },
  progressMeta: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  expiresText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  upcomingRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
  upcomingIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  upcomingInfo: { flex: 1, gap: 2 },
  upcomingTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  upcomingDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  upcomingStarts: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  upcomingReward: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
