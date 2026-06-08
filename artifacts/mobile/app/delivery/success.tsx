import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated as RNAnimated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useColors } from "@/hooks/useColors";
import { useAppStore } from "@/store/appStore";

export default function DeliverySuccessScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { earnings } = useAppStore();
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, { toValue: 1.1, duration: 600, useNativeDriver: true }),
        RNAnimated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleGoHome = () => {
    router.replace("/(tabs)/" as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Success Header */}
      <LinearGradient
        colors={["#34C759", "#27A34F"]}
        style={[styles.hero, { paddingTop: insets.top + (Platform.OS === "web" ? 80 : 80) }]}
      >
        <Animated.View entering={ZoomIn.delay(100).duration(600)} style={styles.checkCircleWrap}>
          <RNAnimated.View style={[styles.checkCirclePulse, { transform: [{ scale: pulseAnim }], backgroundColor: "rgba(255,255,255,0.2)" }]} />
          <View style={styles.checkCircle}>
            <Feather name="check" size={52} color="#FFF" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.heroText}>
          <Text style={styles.heroTitle}>Delivered!</Text>
          <Text style={styles.heroSub}>Great job! Customer is happy 🎉</Text>
        </Animated.View>
      </LinearGradient>

      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.content}>
        {/* Earning Card */}
        <Card style={styles.earningCard}>
          <View style={styles.earningRow}>
            <View style={styles.earningLeft}>
              <Text style={[styles.earningLabel, { color: colors.mutedForeground }]}>
                Order Earning
              </Text>
              <View style={styles.earningAmountRow}>
                <MaterialCommunityIcons name="currency-inr" size={24} color={colors.success} />
                <Text style={[styles.earningAmount, { color: colors.success }]}>65</Text>
              </View>
            </View>
            <View style={[styles.earningDivider, { backgroundColor: colors.border }]} />
            <View style={styles.earningRight}>
              <Text style={[styles.earningLabel, { color: colors.mutedForeground }]}>Today Total</Text>
              <Text style={[styles.todayTotal, { color: colors.foreground }]}>
                ₹{earnings.today}
              </Text>
            </View>
          </View>
        </Card>

        {/* Summary Row */}
        <View style={styles.summaryRow}>
          {[
            { icon: "package", label: "Order", value: "BRG-2024-003", color: colors.primary },
            { icon: "clock", label: "Time", value: "24 min", color: colors.accent },
            { icon: "star", label: "Rating", value: "5 ⭐", color: colors.success },
          ].map((s) => (
            <Card key={s.label} style={styles.summaryCard} shadow>
              <View style={[styles.summaryIcon, { backgroundColor: s.color + "18" }]}>
                <Feather name={s.icon as any} size={16} color={s.color} />
              </View>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* Incentive Progress */}
        <Card style={styles.incentiveCard}>
          <View style={styles.incentiveHeader}>
            <View style={[styles.incentiveIcon, { backgroundColor: colors.accentLight }]}>
              <Feather name="zap" size={20} color={colors.accent} />
            </View>
            <View style={styles.incentiveText}>
              <Text style={[styles.incentiveTitle, { color: colors.foreground }]}>Daily Incentive Progress</Text>
              <Text style={[styles.incentiveSub, { color: colors.mutedForeground }]}>
                4/5 orders completed • ₹200 bonus almost unlocked!
              </Text>
            </View>
          </View>
          <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.accent, width: "80%" }]} />
          </View>
          <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
            Complete 1 more order to unlock ₹200 bonus
          </Text>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Accept Next Order"
            onPress={handleGoHome}
            size="xl"
          />
          <Pressable
            onPress={() => router.push("/(tabs)/earnings")}
            style={[styles.secondaryBtn, { borderColor: colors.border, borderRadius: colors.radiusSm }]}
          >
            <Feather name="trending-up" size={18} color={colors.foreground} />
            <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>View Earnings</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    alignItems: "center",
    paddingBottom: 48,
    gap: 20,
  },
  checkCircleWrap: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 120,
    height: 120,
  },
  checkCirclePulse: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
  },
  heroText: { alignItems: "center", gap: 4 },
  heroTitle: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    color: "#FFF",
    letterSpacing: -1.5,
  },
  heroSub: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
  },
  content: { flex: 1, padding: 20, gap: 16 },
  earningCard: { padding: 20 },
  earningRow: { flexDirection: "row", alignItems: "center" },
  earningLeft: { flex: 1, gap: 4 },
  earningRight: { flex: 1, alignItems: "flex-end", gap: 4 },
  earningDivider: { width: 1, height: 50, marginHorizontal: 16 },
  earningLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  earningAmountRow: { flexDirection: "row", alignItems: "center" },
  earningAmount: { fontSize: 36, fontFamily: "Inter_700Bold", letterSpacing: -1.2 },
  todayTotal: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  summaryRow: { flexDirection: "row", gap: 10 },
  summaryCard: { flex: 1, padding: 14, gap: 8, alignItems: "center" },
  summaryIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  summaryValue: { fontSize: 14, fontFamily: "Inter_700Bold" },
  summaryLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  incentiveCard: { gap: 12 },
  incentiveHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  incentiveIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  incentiveText: { flex: 1, gap: 2 },
  incentiveTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  incentiveSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  progressBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  progressLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  actions: { gap: 10, marginTop: 4 },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderWidth: 1,
  },
  secondaryBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
