import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const BADGES = [
  { id: "1", name: "Speed Star", desc: "50 deliveries under 20 min", icon: "zap", color: "#FF9F0A", earned: true, date: "Mar 2024" },
  { id: "2", name: "5-Star Hero", desc: "100 five-star ratings", icon: "star", color: "#FFB800", earned: true, date: "Feb 2024" },
  { id: "3", name: "Weekend Warrior", desc: "25 weekend deliveries", icon: "sun", color: "#FF6B35", earned: true, date: "Feb 2024" },
  { id: "4", name: "Rain Rider", desc: "10 deliveries during rain", icon: "cloud-rain", color: "#007AFF", earned: true, date: "Jan 2024" },
  { id: "5", name: "Century Club", desc: "100 total deliveries", icon: "award", color: "#34C759", earned: true, date: "Jan 2024" },
  { id: "6", name: "Night Owl", desc: "20 night deliveries", icon: "moon", color: "#5856D6", earned: false },
  { id: "7", name: "Top Earner", desc: "Earn ₹50,000 in a month", icon: "trending-up", color: "#34C759", earned: false },
  { id: "8", name: "Perfect Week", desc: "100% completion in a week", icon: "check-circle", color: "#FF6B35", earned: false },
];

export default function BadgesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const earned = BADGES.filter((b) => b.earned);
  const upcoming = BADGES.filter((b) => !b.earned);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Badges & Achievements" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <View style={[styles.summary, { backgroundColor: colors.accentLight, borderRadius: colors.radiusSm }]}>
          <Feather name="award" size={32} color={colors.accent} />
          <View>
            <Text style={[styles.summaryVal, { color: colors.foreground }]}>{earned.length} Badges Earned</Text>
            <Text style={[styles.summarySub, { color: colors.mutedForeground }]}>{upcoming.length} more to unlock</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Earned Badges</Text>
        <View style={styles.grid}>
          {earned.map((b) => (
            <Card key={b.id} style={styles.badgeCard}>
              <View style={[styles.badgeIcon, { backgroundColor: b.color + "20" }]}>
                <Feather name={b.icon as any} size={28} color={b.color} />
              </View>
              <Text style={[styles.badgeName, { color: colors.foreground }]}>{b.name}</Text>
              <Text style={[styles.badgeDesc, { color: colors.mutedForeground }]}>{b.desc}</Text>
              <Text style={[styles.badgeDate, { color: colors.mutedForeground }]}>{b.date}</Text>
            </Card>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Upcoming Badges</Text>
        <View style={styles.grid}>
          {upcoming.map((b) => (
            <Card key={b.id} style={[styles.badgeCard, { opacity: 0.5 }]}>
              <View style={[styles.badgeIcon, { backgroundColor: colors.muted }]}>
                <Feather name="lock" size={24} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.badgeName, { color: colors.foreground }]}>{b.name}</Text>
              <Text style={[styles.badgeDesc, { color: colors.mutedForeground }]}>{b.desc}</Text>
              <Badge label="Locked" variant="default" size="sm" />
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  summary: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  summaryVal: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  summarySub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  badgeCard: { width: "47%", alignItems: "center", gap: 8 },
  badgeIcon: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  badgeName: { fontSize: 13, fontFamily: "Inter_700Bold", letterSpacing: -0.2, textAlign: "center" },
  badgeDesc: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 16 },
  badgeDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
