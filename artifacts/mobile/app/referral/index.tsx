import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { fadeInDownDelay } from "@/constants/animations";

const REFERRED_AGENTS = [
  { name: "Suresh K.", status: "active", earnings: "₹500 earned", date: "May 15" },
  { name: "Ankit M.", status: "active", earnings: "₹500 earned", date: "May 22" },
  { name: "Priya V.", status: "pending", earnings: "Completing 10 orders", date: "Jun 1" },
];

export default function ReferralScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const referralCode = "BRINGO-RAHUL42";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join Bringo as a delivery partner and earn ₹2000+ daily! Use my referral code ${referralCode} to get a ₹500 bonus on your first 10 deliveries. Download: https://bringo.app/join`,
        title: "Join Bringo Delivery",
      });
    } catch (_) {}
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16), paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Refer & Earn</Text>

      {/* Hero */}
      <Animated.View entering={fadeInDownDelay(50)}>
        <LinearGradient
          colors={["#7C5CFF", "#5C3CDF"]}
          style={[styles.hero, { borderRadius: colors.radius }]}
        >
          <Text style={styles.heroEmoji}>🎁</Text>
          <Text style={styles.heroTitle}>Earn ₹500 per referral!</Text>
          <Text style={styles.heroSub}>
            Invite friends to join Bringo. Get ₹500 when they complete 10 deliveries.
          </Text>
          <View style={styles.statsRow}>
            {[
              { label: "Total Referred", value: "3" },
              { label: "Active", value: "2" },
              { label: "Total Earned", value: "₹1,000" },
            ].map((s, i) => (
              <View key={s.label} style={[styles.statItem, i > 0 && { borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.2)" }]}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Referral Code */}
      <Animated.View entering={fadeInDownDelay(100)}>
        <Card style={styles.codeCard}>
          <Text style={[styles.codeLabel, { color: colors.mutedForeground }]}>YOUR REFERRAL CODE</Text>
          <View style={[styles.codeBox, { backgroundColor: colors.muted, borderRadius: 14 }]}>
            <Text style={[styles.codeText, { color: colors.foreground }]}>{referralCode}</Text>
            <Pressable
              onPress={handleShare}
              style={[styles.copyBtn, { backgroundColor: colors.primary, borderRadius: 10 }]}
            >
              <Feather name="copy" size={16} color="#FFF" />
            </Pressable>
          </View>
          <Button
            title="Share Invite Link"
            onPress={handleShare}
            size="lg"
            icon={<Feather name="share-2" size={16} color="#FFF" />}
          />
        </Card>
      </Animated.View>

      {/* How it works */}
      <Animated.View entering={fadeInDownDelay(150)}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>How it Works</Text>
        <View style={styles.stepsCol}>
          {[
            { step: 1, title: "Share your code", desc: "Send your referral code to friends via WhatsApp, SMS or social media", color: colors.primary },
            { step: 2, title: "Friend joins Bringo", desc: "Your friend downloads the app and registers using your code", color: colors.accentPurple },
            { step: 3, title: "Earn ₹500 bonus!", desc: "Get ₹500 credited to your wallet once they complete 10 deliveries", color: colors.success },
          ].map((s) => (
            <View key={s.step} style={styles.stepRow}>
              <View style={[styles.stepCircle, { backgroundColor: s.color }]}>
                <Text style={styles.stepNum}>{s.step}</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepTitle, { color: colors.foreground }]}>{s.title}</Text>
                <Text style={[styles.stepDesc, { color: colors.mutedForeground }]}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Referred Agents */}
      <Animated.View entering={fadeInDownDelay(200)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your Referrals</Text>
          <Pressable onPress={() => router.push("/referral/status" as any)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See status</Text>
          </Pressable>
        </View>
        <Card padding={0}>
          {REFERRED_AGENTS.map((agent, i) => (
            <View
              key={agent.name}
              style={[styles.agentRow, { borderBottomColor: colors.border, borderBottomWidth: i < REFERRED_AGENTS.length - 1 ? 1 : 0 }]}
            >
              <View style={[styles.agentAvatar, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.agentInitial, { color: colors.primary }]}>{agent.name.charAt(0)}</Text>
              </View>
              <View style={styles.agentInfo}>
                <Text style={[styles.agentName, { color: colors.foreground }]}>{agent.name}</Text>
                <Text style={[styles.agentEarnings, { color: colors.mutedForeground }]}>{agent.earnings}</Text>
              </View>
              <View style={styles.agentRight}>
                <View style={[styles.statusPill, { backgroundColor: agent.status === "active" ? colors.successLight : colors.warningLight }]}>
                  <Text style={[styles.statusText, { color: agent.status === "active" ? colors.success : colors.warning }]}>
                    {agent.status === "active" ? "Active" : "Pending"}
                  </Text>
                </View>
                <Text style={[styles.agentDate, { color: colors.mutedForeground }]}>{agent.date}</Text>
              </View>
            </View>
          ))}
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 20 },
  pageTitle: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  hero: { padding: 24, gap: 12, alignItems: "center" },
  heroEmoji: { fontSize: 44 },
  heroTitle: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#FFF", textAlign: "center", letterSpacing: -0.8 },
  heroSub: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 22 },
  statsRow: { flexDirection: "row", width: "100%", marginTop: 8, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.2)", paddingTop: 16 },
  statItem: { flex: 1, alignItems: "center", gap: 3 },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#FFF" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)" },
  codeCard: { gap: 14 },
  codeLabel: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8 },
  codeBox: { flexDirection: "row", alignItems: "center", padding: 14, gap: 10 },
  codeText: { flex: 1, fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  copyBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  stepsCol: { gap: 16 },
  stepRow: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  stepCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", marginTop: 2 },
  stepNum: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFF" },
  stepInfo: { flex: 1, gap: 3 },
  stepTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  stepDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  agentRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  agentAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  agentInitial: { fontSize: 18, fontFamily: "Inter_700Bold" },
  agentInfo: { flex: 1, gap: 3 },
  agentName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  agentEarnings: { fontSize: 12, fontFamily: "Inter_400Regular" },
  agentRight: { alignItems: "flex-end", gap: 4 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  agentDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
