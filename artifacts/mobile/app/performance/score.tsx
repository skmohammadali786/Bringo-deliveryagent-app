import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";

export default function ScoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { acceptanceRate, completionRate } = useAppStore();

  const scores = [
    { label: "Acceptance Rate", value: acceptanceRate, target: 90, unit: "%" },
    { label: "Completion Rate", value: completionRate, target: 95, unit: "%" },
    { label: "On-Time Delivery", value: 89, target: 90, unit: "%" },
    { label: "Customer Rating", value: 97, target: 90, unit: "%" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Performance Score" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {scores.map((s) => (
          <Card key={s.label} style={styles.scoreCard}>
            <View style={styles.scoreTop}>
              <Text style={[styles.scoreLabel, { color: colors.foreground }]}>{s.label}</Text>
              <View style={styles.scoreRight}>
                <Text style={[styles.scoreValue, { color: s.value >= s.target ? colors.success : colors.warning }]}>{s.value}{s.unit}</Text>
                <Badge label={s.value >= s.target ? "On Target" : "Below Target"} variant={s.value >= s.target ? "success" : "warning"} />
              </View>
            </View>
            <View style={[styles.bar, { backgroundColor: colors.muted }]}>
              <View style={[styles.barFill, { backgroundColor: s.value >= s.target ? colors.success : colors.warning, width: `${Math.min(s.value, 100)}%` }]} />
              <View style={[styles.targetLine, { left: `${s.target}%`, backgroundColor: colors.foreground }]} />
            </View>
            <Text style={[styles.targetLabel, { color: colors.mutedForeground }]}>Target: {s.target}{s.unit}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 14 },
  scoreCard: { gap: 12 },
  scoreTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  scoreLabel: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  scoreRight: { alignItems: "flex-end", gap: 6 },
  scoreValue: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  bar: { height: 8, borderRadius: 4, position: "relative", overflow: "visible" },
  barFill: { height: "100%", borderRadius: 4 },
  targetLine: { position: "absolute", top: -4, width: 2, height: 16, borderRadius: 1 },
  targetLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
