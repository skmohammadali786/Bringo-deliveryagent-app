import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";

const REFERRAL_CODE = "BRNG-AJK-2024";

const HOW_IT_WORKS = [
  { step: "1", text: "Share your referral code with a friend" },
  { step: "2", text: "Friend registers and completes KYC" },
  { step: "3", text: "Friend completes 10 deliveries" },
  { step: "4", text: "You both earn ₹500 bonus!" },
];

export default function ReferralScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const shareCode = async () => {
    await Share.share({
      message: `Join Bringo as a delivery agent and earn up to ₹1500/day! Use my referral code ${REFERRAL_CODE} when registering. Download: https://bringo.in/agent`,
      title: "Join Bringo Agent",
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Refer & Earn" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <LinearGradient colors={["#FF6B35", "#E55A26"]} style={[styles.hero, { borderRadius: colors.radius }]}>
            <Text style={styles.heroTitle}>Refer an Agent</Text>
            <Text style={styles.heroSub}>Earn ₹500 for every agent you refer!</Text>
            <Text style={styles.heroSmall}>Both you and your friend get ₹500 when they complete 10 deliveries</Text>
          </LinearGradient>
        </Animated.View>

        {/* Referral Code */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Card style={styles.codeCard}>
            <Text style={[styles.codeLabel, { color: colors.mutedForeground }]}>YOUR REFERRAL CODE</Text>
            <View style={[styles.codeBox, { backgroundColor: colors.muted, borderRadius: colors.radiusSm }]}>
              <Text style={[styles.code, { color: colors.foreground }]}>{REFERRAL_CODE}</Text>
            </View>
            <View style={styles.codeActions}>
              <Button title="Copy Code" onPress={() => {}} variant="outline" style={{ flex: 1 }} icon={<Feather name="copy" size={14} color={colors.primary} />} />
              <Button title="Share" onPress={shareCode} style={{ flex: 1 }} icon={<Feather name="share-2" size={14} color="#FFF" />} />
            </View>
          </Card>
        </Animated.View>

        {/* How it works */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>How It Works</Text>
          {HOW_IT_WORKS.map((step, i) => (
            <View key={step.step} style={styles.stepRow}>
              <View style={[styles.stepNum, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.stepNumText, { color: colors.primary }]}>{step.step}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.foreground }]}>{step.text}</Text>
              {i < HOW_IT_WORKS.length - 1 && <View style={[styles.stepLine, { backgroundColor: colors.border }]} />}
            </View>
          ))}
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={styles.statsRow}>
            <Pressable onPress={() => router.push("/referral/status" as any)} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
              <Text style={[styles.statVal, { color: colors.foreground }]}>3</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Referred</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/referral/rewards" as any)} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
              <Text style={[styles.statVal, { color: colors.success }]}>₹1,000</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Earned</Text>
            </Pressable>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
              <Text style={[styles.statVal, { color: colors.warning }]}>2</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Pending</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  hero: { padding: 24, gap: 8 },
  heroTitle: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -0.8 },
  heroSub: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.9)" },
  heroSmall: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", lineHeight: 20 },
  codeCard: { gap: 14 },
  codeLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8 },
  codeBox: { padding: 16, alignItems: "center" },
  code: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: 4 },
  codeActions: { flexDirection: "row", gap: 10 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.4 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 8, position: "relative" },
  stepNum: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", zIndex: 1 },
  stepNumText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  stepText: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 22 },
  stepLine: { position: "absolute", left: 18, top: 44, width: 2, height: 16 },
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1, alignItems: "center", padding: 16, gap: 4, borderWidth: 1 },
  statVal: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
