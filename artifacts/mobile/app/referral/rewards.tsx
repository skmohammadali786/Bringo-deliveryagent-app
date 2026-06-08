import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const REWARDS_HISTORY = [
  { id: "1", type: "referral", label: "Referral Bonus — Suresh K.", amount: 500, date: "Jun 5, 2026", status: "credited" },
  { id: "2", type: "referral", label: "Referral Bonus — Ankit M.", amount: 500, date: "May 25, 2026", status: "credited" },
  { id: "3", type: "badge", label: "Speed Demon Badge Reward", amount: 200, date: "May 10, 2026", status: "credited" },
  { id: "4", type: "incentive", label: "Weekly Streak Bonus", amount: 300, date: "May 1, 2026", status: "credited" },
  { id: "5", type: "referral", label: "Referral Bonus — Priya V.", amount: 500, date: "Jun 1, 2026", status: "pending" },
];

const REWARD_TYPES: Record<string, { color: string; icon: string }> = {
  referral: { color: "#7C5CFF", icon: "users" },
  badge: { color: "#FFB800", icon: "award" },
  incentive: { color: "#34C759", icon: "zap" },
};

export default function ReferralRewardsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const totalEarned = REWARDS_HISTORY.filter((r) => r.status === "credited").reduce((sum, r) => sum + r.amount, 0);
  const totalPending = REWARDS_HISTORY.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Referral Rewards" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <View style={styles.summaryRow}>
            <Card style={[styles.summaryCard, { backgroundColor: colors.successLight, borderColor: colors.success + "30" }]}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.success + "20" }]}>
                <Feather name="check-circle" size={20} color={colors.success} />
              </View>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Total Earned</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>₹{totalEarned}</Text>
            </Card>
            <Card style={[styles.summaryCard, { backgroundColor: colors.warningLight, borderColor: colors.warning + "30" }]}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.warning + "20" }]}>
                <Feather name="clock" size={20} color={colors.warning} />
              </View>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Pending</Text>
              <Text style={[styles.summaryValue, { color: colors.warning }]}>₹{totalPending}</Text>
            </Card>
          </View>
        </Animated.View>

        {/* Reward Types */}
        <Animated.View entering={FadeInDown.delay(60).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Reward Types</Text>
          <View style={styles.typeCards}>
            {[
              { type: "referral", label: "Referral Bonus", desc: "₹500 per active referral", color: "#7C5CFF" },
              { type: "badge", label: "Badge Rewards", desc: "₹50–₹500 per badge", color: "#FFB800" },
              { type: "incentive", label: "Daily Incentives", desc: "Up to ₹500/day bonus", color: "#34C759" },
            ].map((t) => (
              <Card key={t.type} style={styles.typeCard}>
                <View style={[styles.typeIcon, { backgroundColor: t.color + "18" }]}>
                  <Feather name={REWARD_TYPES[t.type].icon as any} size={18} color={t.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.typeLabel, { color: colors.foreground }]}>{t.label}</Text>
                  <Text style={[styles.typeSub, { color: colors.mutedForeground }]}>{t.desc}</Text>
                </View>
              </Card>
            ))}
          </View>
        </Animated.View>

        {/* History */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Reward History</Text>
          <Card padding={0}>
            {REWARDS_HISTORY.map((r, i) => {
              const cfg = REWARD_TYPES[r.type];
              return (
                <View
                  key={r.id}
                  style={[
                    styles.historyRow,
                    { borderBottomColor: colors.border, borderBottomWidth: i < REWARDS_HISTORY.length - 1 ? 1 : 0 },
                  ]}
                >
                  <View style={[styles.historyIcon, { backgroundColor: cfg.color + "18" }]}>
                    <Feather name={cfg.icon as any} size={18} color={cfg.color} />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={[styles.historyLabel, { color: colors.foreground }]} numberOfLines={1}>
                      {r.label}
                    </Text>
                    <Text style={[styles.historyDate, { color: colors.mutedForeground }]}>{r.date}</Text>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={[styles.historyAmount, { color: r.status === "credited" ? colors.success : colors.warning }]}>
                      +₹{r.amount}
                    </Text>
                    <View style={[styles.statusPill, { backgroundColor: r.status === "credited" ? colors.successLight : colors.warningLight }]}>
                      <Text style={[styles.statusText, { color: r.status === "credited" ? colors.success : colors.warning }]}>
                        {r.status === "credited" ? "Paid" : "Pending"}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  summaryRow: { flexDirection: "row", gap: 10 },
  summaryCard: { flex: 1, alignItems: "center", gap: 8, padding: 16, borderWidth: 1 },
  summaryIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  summaryLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  typeCards: { gap: 10 },
  typeCard: { flexDirection: "row", alignItems: "center", gap: 14 },
  typeIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  typeLabel: { fontSize: 14, fontFamily: "Inter_700Bold" },
  typeSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  historyRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
  historyIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  historyInfo: { flex: 1, gap: 2 },
  historyLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  historyDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  historyRight: { alignItems: "flex-end", gap: 4 },
  historyAmount: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Inter_700Bold" },
});
