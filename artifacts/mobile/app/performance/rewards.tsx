import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const AVAILABLE_REWARDS = [
  { id: "1", title: "Free Helmet Upgrade",  points: 500,  icon: "shield",   color: "#FF6B35", value: "₹2500" },
  { id: "2", title: "1 Month Insurance",    points: 1000, icon: "umbrella", color: "#4A90E2", value: "₹800"  },
  { id: "3", title: "Fuel Card ₹200",       points: 200,  icon: "zap",      color: "#34C759", value: "₹200"  },
  { id: "4", title: "Amazon Voucher",       points: 300,  icon: "gift",     color: "#FF9A3D", value: "₹250"  },
  { id: "5", title: "Bringo Jacket",        points: 800,  icon: "star",     color: "#7C5CFF", value: "₹1200" },
  { id: "6", title: "Coffee Voucher",       points: 100,  icon: "coffee",   color: "#A0522D", value: "₹80"   },
];

const EARNED_REWARDS = [
  { id: "e1", title: "Coffee Voucher",  redeemedOn: "Jun 1, 2026",  icon: "coffee", color: "#FF9A3D" },
  { id: "e2", title: "Fuel Card ₹100", redeemedOn: "May 15, 2026", icon: "zap",    color: "#34C759" },
];

export default function RewardsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [currentPoints] = useState(1250);
  const [redeemAmount, setRedeemAmount] = useState("");

  const parsedAmount = parseInt(redeemAmount, 10) || 0;
  const canCustomRedeem = parsedAmount >= 100 && parsedAmount <= currentPoints;

  const handleCustomRedeem = () => {
    if (!canCustomRedeem) return;
    const cashback = Math.floor(parsedAmount * 0.8);
    Alert.alert(
      "Confirm Redemption",
      `Redeem ${parsedAmount.toLocaleString("en-IN")} points for ₹${cashback} cashback?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Redeem",
          onPress: () => {
            setRedeemAmount("");
            Alert.alert("Redeemed!", `₹${cashback} added to your wallet.`);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Rewards" showBack />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 16 : 16 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Points Balance */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <Card style={[styles.pointsCard, { backgroundColor: "#1A1A2E" }]}>
            <View style={styles.pointsLeft}>
              <Text style={styles.pointsLabel}>Your Points</Text>
              <Text style={styles.pointsValue} numberOfLines={1} adjustsFontSizeToFit>
                {currentPoints.toLocaleString("en-IN")}
              </Text>
              <Text style={styles.pointsSub}>pts available</Text>
            </View>
            <View style={styles.pointsRight}>
              {[
                { icon: "info" as const,  label: "1 delivery = 5 pts" },
                { icon: "star" as const,  label: "5-star = 10 pts"    },
                { icon: "clock" as const, label: "Peak hrs = 2× pts"  },
              ].map((row) => (
                <View key={row.label} style={styles.howEarn}>
                  <Feather name={row.icon} size={12} color="rgba(255,255,255,0.55)" />
                  <Text style={styles.howEarnTxt}>{row.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Quick Redeem Card */}
        <Animated.View entering={FadeInDown.delay(60).duration(400)}>
          <Card style={styles.quickRedeemCard}>
            <Text style={[styles.quickRedeemTitle, { color: colors.foreground }]}>Quick Redeem</Text>
            <Text style={[styles.quickRedeemSub, { color: colors.mutedForeground }]}>
              Convert points to wallet cashback · min 100 pts = ₹80
            </Text>
            <View style={styles.redeemInputRow}>
              <View
                style={[
                  styles.inputWrap,
                  { backgroundColor: colors.muted, borderColor: colors.border, borderWidth: 1, borderRadius: 14 },
                ]}
              >
                <Feather name="star" size={15} color={colors.primary} style={{ marginLeft: 12 }} />
                <TextInput
                  value={redeemAmount}
                  onChangeText={(t) => setRedeemAmount(t.replace(/[^0-9]/g, ""))}
                  placeholder="Points to redeem"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="number-pad"
                  style={[styles.redeemInput, { color: colors.foreground }]}
                  maxLength={4}
                  returnKeyType="done"
                />
                {parsedAmount > 0 && (
                  <Text style={[styles.inputEquiv, { color: colors.success }]}>
                    ≈ ₹{Math.floor(parsedAmount * 0.8)}
                  </Text>
                )}
              </View>
              <Pressable
                onPress={handleCustomRedeem}
                disabled={!canCustomRedeem}
                style={[
                  styles.redeemCTA,
                  { backgroundColor: canCustomRedeem ? colors.primary : colors.muted, borderRadius: 14 },
                ]}
              >
                <Text style={[styles.redeemCTATxt, { color: canCustomRedeem ? "#FFF" : colors.mutedForeground }]}>
                  Redeem
                </Text>
              </Pressable>
            </View>
            {parsedAmount > currentPoints && parsedAmount > 0 && (
              <Text style={[styles.redeemError, { color: colors.destructive }]}>
                Not enough points (you have {currentPoints.toLocaleString("en-IN")})
              </Text>
            )}
          </Card>
        </Animated.View>

        {/* Available Rewards Grid */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Redeem for Rewards</Text>
          <View style={styles.rewardsGrid}>
            {AVAILABLE_REWARDS.map((reward, i) => {
              const canRedeem = currentPoints >= reward.points;
              return (
                <Animated.View key={reward.id} entering={FadeInDown.delay(140 + i * 40).duration(400)} style={styles.rewardWrapper}>
                  <Card style={[styles.rewardCard, !canRedeem && { opacity: 0.55 }]}>
                    <View style={[styles.rewardIcon, { backgroundColor: reward.color + "18" }]}>
                      <Feather name={reward.icon as any} size={22} color={reward.color} />
                    </View>
                    <Text style={[styles.rewardTitle, { color: colors.foreground }]} numberOfLines={2}>
                      {reward.title}
                    </Text>
                    <Text style={[styles.rewardValue, { color: colors.mutedForeground }]}>
                      Worth {reward.value}
                    </Text>
                    <Pressable
                      style={[
                        styles.redeemBtn,
                        { backgroundColor: canRedeem ? reward.color : colors.muted, borderRadius: 10 },
                      ]}
                      disabled={!canRedeem}
                      onPress={() =>
                        canRedeem &&
                        Alert.alert(
                          "Confirm Redemption",
                          `Use ${reward.points} pts for "${reward.title}"?`,
                          [
                            { text: "Cancel", style: "cancel" },
                            { text: "Confirm", onPress: () => Alert.alert("Done!", `"${reward.title}" will arrive soon.`) },
                          ]
                        )
                      }
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
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Redeemed Rewards</Text>
          <Card padding={0}>
            {EARNED_REWARDS.map((r, i) => (
              <View
                key={r.id}
                style={[
                  styles.earnedRow,
                  { borderBottomColor: colors.border, borderBottomWidth: i < EARNED_REWARDS.length - 1 ? 1 : 0 },
                ]}
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
  pointsCard: { flexDirection: "row", alignItems: "center", padding: 20 },
  pointsLeft: { flex: 1, gap: 4 },
  pointsLabel: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  pointsValue: { fontSize: 48, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -2 },
  pointsSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.65)" },
  pointsRight: { gap: 8, paddingLeft: 10 },
  howEarn: { flexDirection: "row", alignItems: "center", gap: 6 },
  howEarnTxt: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  quickRedeemCard: { gap: 12 },
  quickRedeemTitle: { fontSize: 17, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  quickRedeemSub: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  redeemInputRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  inputWrap: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, height: 50 },
  redeemInput: { flex: 1, fontSize: 15, fontFamily: "Inter_600SemiBold", paddingVertical: 0 },
  inputEquiv: { fontSize: 13, fontFamily: "Inter_700Bold", marginRight: 12 },
  redeemCTA: { height: 50, paddingHorizontal: 18, alignItems: "center", justifyContent: "center" },
  redeemCTATxt: { fontSize: 14, fontFamily: "Inter_700Bold" },
  redeemError: { fontSize: 12, fontFamily: "Inter_400Regular" },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  rewardsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  rewardWrapper: { width: "47%" },
  rewardCard: { gap: 10, alignItems: "center", padding: 16, minHeight: 175 },
  rewardIcon: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  rewardTitle: { fontSize: 13, fontFamily: "Inter_700Bold", textAlign: "center", lineHeight: 18 },
  rewardValue: { fontSize: 11, fontFamily: "Inter_400Regular" },
  redeemBtn: { paddingHorizontal: 12, paddingVertical: 8, marginTop: "auto" },
  redeemTxt: { fontSize: 12, fontFamily: "Inter_700Bold" },
  earnedRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
  earnedIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  earnedInfo: { flex: 1, gap: 3 },
  earnedTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  earnedDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  redeemedBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  redeemedText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
