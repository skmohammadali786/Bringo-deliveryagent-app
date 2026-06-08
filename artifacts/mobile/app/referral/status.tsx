import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDown, fadeInDownDelay, fadeInDownIndexed } from "@/constants/animations";

const REFERRALS = [
  { id: "1", name: "Suresh K.", phone: "98765•••••", joined: "May 15, 2026", deliveries: 28, status: "active", earned: 500 },
  { id: "2", name: "Ankit M.", phone: "87654•••••", joined: "May 22, 2026", deliveries: 15, status: "active", earned: 500 },
  { id: "3", name: "Priya V.", phone: "76543•••••", joined: "Jun 1, 2026", deliveries: 6, status: "in_progress", earned: 0 },
];

const STATUS_CONFIG = {
  active: { label: "Active", color: "#34C759", bgColor: "#E8F9EC", icon: "check-circle" as const },
  in_progress: { label: "In Progress", color: "#FF9A3D", bgColor: "#FFF5E6", icon: "clock" as const },
  inactive: { label: "Inactive", color: "#5B5B5B", bgColor: "#EBE8E1", icon: "x-circle" as const },
};

export default function ReferralStatusScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const totalEarned = REFERRALS.reduce((s, r) => s + r.earned, 0);
  const active = REFERRALS.filter((r) => r.status === "active").length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Referral Status" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <Animated.View entering={fadeInDown(0)}>
          <View style={styles.summaryRow}>
            {[
              { label: "Total Referred", value: REFERRALS.length.toString(), icon: "users", color: colors.accentPurple },
              { label: "Active", value: active.toString(), icon: "check-circle", color: colors.success },
              { label: "Earned", value: `₹${totalEarned}`, icon: "trending-up", color: colors.primary },
            ].map((s) => (
              <Card key={s.label} style={styles.summaryCard} shadow>
                <View style={[styles.summaryIcon, { backgroundColor: s.color + "18" }]}>
                  <Feather name={s.icon as any} size={18} color={s.color} />
                </View>
                <Text style={[styles.summaryValue, { color: colors.foreground }]}>{s.value}</Text>
                <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
              </Card>
            ))}
          </View>
        </Animated.View>

        {/* Requirement Info */}
        <Animated.View entering={fadeInDownDelay(80)}>
          <Card style={[styles.requireCard, { backgroundColor: colors.infoLight }]}>
            <Feather name="info" size={16} color={colors.info} />
            <Text style={[styles.requireText, { color: colors.info }]}>
              Your referral earns a ₹500 bonus when their referred partner completes 10 deliveries
            </Text>
          </Card>
        </Animated.View>

        {/* Referrals List */}
        <Animated.View entering={fadeInDownDelay(140)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your Referrals</Text>
          {REFERRALS.map((ref, i) => {
            const cfg = STATUS_CONFIG[ref.status as keyof typeof STATUS_CONFIG];
            return (
              <Animated.View key={ref.id} entering={fadeInDownIndexed(200, i)}>
                <Card style={styles.referralCard}>
                  {/* Top row */}
                  <View style={styles.refTop}>
                    <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                      <Text style={[styles.avatarInitial, { color: colors.primary }]}>
                        {ref.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.refInfo}>
                      <Text style={[styles.refName, { color: colors.foreground }]}>{ref.name}</Text>
                      <Text style={[styles.refPhone, { color: colors.mutedForeground }]}>{ref.phone}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: cfg.bgColor }]}>
                      <Feather name={cfg.icon} size={12} color={cfg.color} />
                      <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                    </View>
                  </View>

                  {/* Progress */}
                  <View style={[styles.progressSection, { borderTopColor: colors.border }]}>
                    <View style={styles.progressInfo}>
                      <Text style={[styles.deliveryCount, { color: colors.foreground }]}>
                        {ref.deliveries}/10 deliveries
                      </Text>
                      <Text style={[styles.earnedText, { color: ref.earned > 0 ? colors.success : colors.mutedForeground }]}>
                        {ref.earned > 0 ? `+₹${ref.earned} earned` : "Pending completion"}
                      </Text>
                    </View>
                    <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            backgroundColor: ref.status === "active" ? colors.success : colors.warning,
                            width: `${Math.min((ref.deliveries / 10) * 100, 100)}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <Text style={[styles.joinDate, { color: colors.mutedForeground }]}>
                    Joined {ref.joined}
                  </Text>
                </Card>
              </Animated.View>
            );
          })}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  summaryRow: { flexDirection: "row", gap: 10 },
  summaryCard: { flex: 1, alignItems: "center", gap: 6, padding: 14 },
  summaryIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  summaryValue: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  summaryLabel: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  requireCard: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14 },
  requireText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  referralCard: { gap: 12 },
  refTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  avatarInitial: { fontSize: 20, fontFamily: "Inter_700Bold" },
  refInfo: { flex: 1, gap: 3 },
  refName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  refPhone: { fontSize: 12, fontFamily: "Inter_400Regular" },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  statusText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  progressSection: { borderTopWidth: 1, paddingTop: 12, gap: 8 },
  progressInfo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  deliveryCount: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  earnedText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  progressBar: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  joinDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
