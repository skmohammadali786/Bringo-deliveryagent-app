import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const EARNED_BADGES = [
  { id: "1", name: "Speed Demon", desc: "Completed 50+ deliveries in under 20 min", icon: "zap", color: "#FFB800", earned: true },
  { id: "2", name: "5-Star Agent", desc: "Maintained 5.0 rating for 30 days", icon: "star", color: "#FF6B35", earned: true },
  { id: "3", name: "Century Club", desc: "Completed 100 deliveries", icon: "award", color: "#7C5CFF", earned: true },
  { id: "4", name: "Weekend Warrior", desc: "50 deliveries on weekends", icon: "sun", color: "#00BFA6", earned: true },
];

const LOCKED_BADGES = [
  { id: "5", name: "Super Agent", desc: "Complete 500 total deliveries", icon: "trending-up", color: "#4A90E2", progress: 152, target: 500 },
  { id: "6", name: "Night Owl", desc: "10 deliveries after 10 PM", icon: "moon", color: "#7C5CFF", progress: 4, target: 10 },
  { id: "7", name: "Perfect Week", desc: "Zero cancellations for 7 days", icon: "check-circle", color: "#34C759", progress: 5, target: 7 },
  { id: "8", name: "Elite Partner", desc: "Top 1% in your city", icon: "shield", color: "#FF6B35", progress: 10, target: 100 },
];

export default function BadgesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Badges & Rewards" showBack />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Banner */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <Card style={[styles.statsBanner, { backgroundColor: colors.accentPurple + "14" }]}>
            {[
              { label: "Earned", value: `${EARNED_BADGES.length}`, icon: "award", color: colors.accentPurple },
              { label: "In Progress", value: `${LOCKED_BADGES.length}`, icon: "clock", color: colors.warning },
              { label: "Rank", value: "#42", icon: "trending-up", color: colors.success },
            ].map((s, i) => (
              <View
                key={s.label}
                style={[
                  styles.statItem,
                  i > 0 && { borderLeftWidth: 1, borderLeftColor: colors.border },
                ]}
              >
                <View style={[styles.statIcon, { backgroundColor: s.color + "18" }]}>
                  <Feather name={s.icon as any} size={16} color={s.color} />
                </View>
                <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Earned */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Earned Badges</Text>
          <View style={styles.badgeGrid}>
            {EARNED_BADGES.map((b, i) => (
              <Animated.View key={b.id} entering={FadeInDown.delay(100 + i * 60).duration(400)}>
                <Card style={styles.badgeCard} shadow>
                  <View style={[styles.badgeIconWrap, { backgroundColor: b.color + "18" }]}>
                    <Feather name={b.icon as any} size={28} color={b.color} />
                  </View>
                  <View style={[styles.earnedMark, { backgroundColor: colors.success }]}>
                    <Feather name="check" size={10} color="#FFF" />
                  </View>
                  <Text style={[styles.badgeName, { color: colors.foreground }]}>{b.name}</Text>
                  <Text style={[styles.badgeDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                    {b.desc}
                  </Text>
                </Card>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* In Progress */}
        <Animated.View entering={FadeInDown.delay(240).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>In Progress</Text>
          <Card padding={0}>
            {LOCKED_BADGES.map((b, i) => (
              <View
                key={b.id}
                style={[
                  styles.progressBadge,
                  { borderBottomColor: colors.border, borderBottomWidth: i < LOCKED_BADGES.length - 1 ? 1 : 0 },
                ]}
              >
                <View style={[styles.progressIcon, { backgroundColor: b.color + "14" }]}>
                  <Feather name={b.icon as any} size={20} color={b.color} />
                </View>
                <View style={styles.progressInfo}>
                  <Text style={[styles.progressName, { color: colors.foreground }]}>{b.name}</Text>
                  <Text style={[styles.progressDesc, { color: colors.mutedForeground }]}>{b.desc}</Text>
                  <View style={[styles.progressBarBg, { backgroundColor: colors.muted }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          backgroundColor: b.color,
                          width: `${Math.min((b.progress / b.target) * 100, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressCount, { color: colors.mutedForeground }]}>
                    {b.progress}/{b.target}
                  </Text>
                </View>
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
  statsBanner: { flexDirection: "row", padding: 16 },
  statItem: { flex: 1, alignItems: "center", gap: 6 },
  statIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  badgeCard: { width: "47%", alignItems: "center", gap: 10, padding: 16, position: "relative", minHeight: 180 },
  badgeIconWrap: { width: 64, height: 64, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  earnedMark: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeName: { fontSize: 13, fontFamily: "Inter_700Bold", textAlign: "center" },
  badgeDesc: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 16 },
  progressBadge: { flexDirection: "row", alignItems: "flex-start", gap: 14, padding: 14 },
  progressIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 2 },
  progressInfo: { flex: 1, gap: 6 },
  progressName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  progressDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  progressBarBg: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 3 },
  progressCount: { fontSize: 11, fontFamily: "Inter_500Medium" },
});
