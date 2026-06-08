import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const AVAILABLE_REWARDS = [
  { id: "1", title: "Free Helmet Upgrade", points: 500, type: "product", icon: "shield", color: "#FF6B35", value: "₹2500" },
  { id: "2", title: "1 Month Free Insurance", points: 1000, type: "insurance", icon: "umbrella", color: "#4A90E2", value: "₹800" },
  { id: "3", title: "Fuel Card ₹200", points: 200, type: "fuel", icon: "zap", color: "#34C759", value: "₹200" },
  { id: "4", title: "Amazon Gift Voucher", points: 300, type: "voucher", icon: "gift", color: "#FF9A3D", value: "₹250" },
  { id: "5", title: "Bringo Branded Jacket", points: 800, type: "product", icon: "star", color: "#7C5CFF", value: "₹1200" },
];

const EARNED_REWARDS = [
  { id: "e1", title: "Coffee Voucher", redeemedOn: "Jun 1, 2026", icon: "coffee", color: "#FF9A3D" },
  { id: "e2", title: "Fuel Card ₹100", redeemedOn: "May 15, 2026", icon: "zap", color: "#34C759" },
];

export default function RewardsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const currentPoints = 1250;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Rewards" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Points Balance */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <Card style={[styles.pointsCard, { backgroundColor: "#1A1A2E" }]}>
            <View style={styles.pointsLeft}>
              <Text style={styles.pointsLabel}>Your Points</Text>
              <Text style={styles.pointsValue}>{currentPoints.toLocaleString("en-IN")}</Text>
              <Text style={styles.pointsSub}>Pts</Text>
            </View>
            <View style={styles.pointsRight}>
              <View style={styles.howEarn}>
                <Feather name="info" size={14} color="rgba(255,255,255,0.6)" />
                <Text style={styles.howEarnTxt}>1 delivery = 5 pts</Text>
              </View>
              <View style={styles.howEarn}>
                <Feather name="star" size={14} color="#FFB800" />
                <Text style={styles.howEarnTxt}>5-star = 10 pts</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Available Rewards */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Redeem Points</Text>
          <View style={styles.rewardsGrid}>
            {AVAILABLE_REWARDS.map((reward, i) => {
              const canRedeem = currentPoints >= reward.points;
              return (
                <Animated.View key={reward.id} entering={FadeInDown.delay(100 + i * 50).duration(400)}>
                  <Card style={[styles.rewardCard, !canRedeem && { opacity: 0.6 }]}>
                    <View style={[styles.rewardIcon, { backgroundColor: reward.color + "18" }]}>
                      <Feather name={reward.icon as any} size={22} color={reward.color} />
                    </View>
                    <Text style={[styles.rewardTitle, { color: colors.foreground }]}>{reward.title}</Text>
                    <Text style={[styles.rewardValue, { color: colors.mutedForeground }]}>Worth {reward.value}</Text>
                    <Pressable
                      style={[
                        styles.redeemBtn,
                        { backgroundColor: canRedeem ? reward.color : colors.muted, borderRadius: colors.radiusXs },
                      ]}
                      disabled={!canRedeem}
                    >
                      <Text style={[styles.redeemTxt, { color: canRedeem ? "#FFF" : colors.mutedForeground }]}>
                        {reward.points} pts
                      </Text>
                    </Pressable>
                  </Card>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Earned History */}
        <Animated.View entering={FadeInDown.delay(360).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Redeemed Rewards</Text>
          <Card padding={0}>
            {EARNED_REWARDS.map((r, i) => (
              <View
                key={r.id}
                style={[styles.earnedRow, { borderBottomColor: colors.border, borderBottomWidth: i < EARNED_REWARDS.length - 1 ? 1 : 0 }]}
              >
                <View style={[styles.earnedIcon, { backgroundColor: r.color + "18" }]}>
                  <Feather name={r.icon as any} size={18} color={r.color} />
                </View>
                <View style={styles.earnedInfo}>
                  <Text style={[styles.earnedTitle, { color: colors.foreground }]}>{r.title}</Text>
                  <Text style={[styles.earnedDate, { color: colors.mutedForeground }]}>Redeemed {r.redeemedOn}</Text>
                </View>
                <View style={[styles.redeemedBadge, { backgroundColor: colors.successLight }]}>
                  <Text style={[styles.redeemedText, { color: colors.success }]}>✓ Used</Text>
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
  pointsCard: { flexDirection: "row", alignItems: "center", overflow: "hidden" },
  pointsLeft: { flex: 1, gap: 4 },
  pointsLabel: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  pointsValue: { fontSize: 52, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -2 },
  pointsSub: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  pointsRight: { gap: 10 },
  howEarn: { flexDirection: "row", alignItems: "center", gap: 6 },
  howEarnTxt: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  rewardsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  rewardCard: { width: "47%", gap: 10, alignItems: "center", padding: 16 },
  rewardIcon: { width: 56, height: 56, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  rewardTitle: { fontSize: 13, fontFamily: "Inter_700Bold", textAlign: "center" },
  rewardValue: { fontSize: 11, fontFamily: "Inter_400Regular" },
  redeemBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  redeemTxt: { fontSize: 12, fontFamily: "Inter_700Bold" },
  earnedRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
  earnedIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  earnedInfo: { flex: 1, gap: 3 },
  earnedTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  earnedDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  redeemedBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  redeemedText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
