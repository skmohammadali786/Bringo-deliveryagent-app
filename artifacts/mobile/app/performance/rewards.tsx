import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const REWARDS = [
  { id: "1", name: "Free Petrol Voucher", points: 500, category: "Fuel", icon: "droplet" },
  { id: "2", name: "₹200 Bonus", points: 300, category: "Cash", icon: "dollar-sign" },
  { id: "3", name: "Phone Recharge ₹99", points: 150, category: "Recharge", icon: "smartphone" },
  { id: "4", name: "Health Insurance Top-up", points: 800, category: "Insurance", icon: "shield" },
];

export default function RewardsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const points = 650;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Rewards" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Card style={[styles.pointsCard, { backgroundColor: colors.secondary }]}>
          <Text style={styles.pointsLabel}>Your Points Balance</Text>
          <Text style={styles.pointsVal}>{points.toLocaleString()}</Text>
          <Text style={styles.pointsSub}>pts</Text>
          <Text style={styles.pointsHint}>Earn 1 point per ₹1 delivery fee</Text>
        </Card>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Redeem Rewards</Text>
        {REWARDS.map((r) => (
          <Card key={r.id} style={styles.rewardCard}>
            <View style={[styles.rewardIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name={r.icon as any} size={24} color={colors.primary} />
            </View>
            <View style={styles.rewardText}>
              <Text style={[styles.rewardName, { color: colors.foreground }]}>{r.name}</Text>
              <Text style={[styles.rewardCat, { color: colors.mutedForeground }]}>{r.category}</Text>
            </View>
            <View style={styles.rewardAction}>
              <Text style={[styles.rewardPoints, { color: colors.primary }]}>{r.points} pts</Text>
              <Button title="Redeem" onPress={() => {}} disabled={points < r.points} fullWidth={false} size="sm" />
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },
  pointsCard: { alignItems: "center", gap: 4, paddingVertical: 28 },
  pointsLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.7)" },
  pointsVal: { fontSize: 56, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -2 },
  pointsSub: { fontSize: 18, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.7)", marginTop: -8 },
  pointsHint: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.5)", marginTop: 4 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  rewardCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  rewardIcon: { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  rewardText: { flex: 1, gap: 4 },
  rewardName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  rewardCat: { fontSize: 12, fontFamily: "Inter_400Regular" },
  rewardAction: { alignItems: "flex-end", gap: 6 },
  rewardPoints: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
