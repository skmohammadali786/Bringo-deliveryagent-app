import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const INCENTIVES = [
  { id: "1", title: "5-Order Bonus", desc: "Complete 5 orders today", reward: "₹200", progress: 3, target: 5, deadline: "Today 11:59 PM", active: true },
  { id: "2", title: "Weekend Warrior", desc: "10 orders on Saturday & Sunday", reward: "₹500", progress: 6, target: 10, deadline: "Sunday 11:59 PM", active: true },
  { id: "3", title: "Peak Hour Hero", desc: "3 deliveries between 12–2 PM", reward: "₹150", progress: 3, target: 3, deadline: "Completed", active: false },
  { id: "4", title: "Monthly Milestone", desc: "150 deliveries this month", reward: "₹2,000", progress: 120, target: 150, deadline: "Mar 31", active: true },
];

export default function IncentivesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Active Incentives" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {INCENTIVES.map((inc) => (
          <Card key={inc.id} style={[styles.card, { borderColor: inc.active && inc.progress >= inc.target ? colors.success : colors.border }]}>
            <View style={styles.cardTop}>
              <View style={[styles.icon, { backgroundColor: inc.active && inc.progress < inc.target ? colors.primaryLight : colors.successLight }]}>
                <Feather name="award" size={22} color={inc.active && inc.progress < inc.target ? colors.primary : colors.success} />
              </View>
              <View style={styles.titleSection}>
                <Text style={[styles.incTitle, { color: colors.foreground }]}>{inc.title}</Text>
                <Text style={[styles.incDesc, { color: colors.mutedForeground }]}>{inc.desc}</Text>
              </View>
              <Text style={[styles.reward, { color: colors.success }]}>{inc.reward}</Text>
            </View>
            {inc.progress < inc.target ? (
              <>
                <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
                  <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${(inc.progress / inc.target) * 100}%` }]} />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={[styles.progressText, { color: colors.mutedForeground }]}>{inc.progress}/{inc.target} completed</Text>
                  <Text style={[styles.deadline, { color: colors.warning }]}>{inc.deadline}</Text>
                </View>
              </>
            ) : (
              <Badge label="Completed! Bonus credited." variant="success" />
            )}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 14 },
  card: { gap: 14 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  icon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  titleSection: { flex: 1, gap: 2 },
  incTitle: { fontSize: 15, fontFamily: "Inter_700Bold", letterSpacing: -0.2 },
  incDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  reward: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  progressBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  progressLabels: { flexDirection: "row", justifyContent: "space-between" },
  progressText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  deadline: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
