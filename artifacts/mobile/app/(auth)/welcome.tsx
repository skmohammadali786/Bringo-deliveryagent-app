import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fadeInUpDelay, fadeInUpIndexed } from "@/constants/animations";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";

const { width, height } = Dimensions.get("window");

const FEATURES = [
  {
    icon: "package" as const,
    label: "Pick up & deliver orders",
    sub: "From top stores near you",
    color: "#FF6B35",
    bg: "#FFF0EB",
  },
  {
    icon: "trending-up" as const,
    label: "Earn ₹800–₹1500 daily",
    sub: "Real-time tracking & bonuses",
    color: "#34C759",
    bg: "#E8F9EC",
  },
  {
    icon: "shield" as const,
    label: "Safe & fully insured",
    sub: "24/7 support & SOS button",
    color: "#4A90E2",
    bg: "#EBF3FC",
  },
];

const STATS = [
  { value: "50K+", label: "Active agents" },
  { value: "₹1500", label: "Max daily" },
  { value: "4.8★", label: "App rating" },
];

export default function WelcomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero Section */}
      <LinearGradient
        colors={["#FF6B35", "#E8501C", "#FF8C5A"]}
        style={[styles.hero, { paddingTop: insets.top + (Platform.OS === "web" ? 60 : 60) }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View entering={FadeInDown.delay(0).duration(700)} style={styles.heroContent}>
          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons name="moped" size={44} color="#FF6B35" />
            </View>
          </View>

          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Start Earning</Text>
            <Text style={styles.heroTitleAccent}>With Bringo</Text>
            <Text style={styles.heroSub}>
              Join India's fastest-growing{"\n"}delivery partner network
            </Text>
          </View>

          {/* Stats Row */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.statsRow}>
            {STATS.map((s, i) => (
              <View
                key={s.value}
                style={[
                  styles.statItem,
                  i > 0 && { borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.25)" },
                ]}
              >
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </Animated.View>
        </Animated.View>
      </LinearGradient>

      {/* Bottom Section */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 32 }]}>
        {/* Feature Cards */}
        {FEATURES.map((f, i) => (
          <Animated.View
            key={f.label}
            entering={fadeInUpIndexed(300, i)}
            style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.featureIcon, { backgroundColor: f.bg }]}>
              <Feather name={f.icon} size={20} color={f.color} />
            </View>
            <View style={styles.featureText}>
              <Text style={[styles.featureLabel, { color: colors.foreground }]}>{f.label}</Text>
              <Text style={[styles.featureSub, { color: colors.mutedForeground }]}>{f.sub}</Text>
            </View>
          </Animated.View>
        ))}

        {/* CTA */}
        <Animated.View entering={fadeInUpDelay(700)} style={styles.ctaSection}>
          <Button
            title="Get Started as Agent"
            onPress={() => router.push("/(auth)/login")}
            size="xl"
          />
          <Text style={[styles.terms, { color: colors.mutedForeground }]}>
            By continuing, you agree to our{" "}
            <Text style={{ color: colors.primary }}>Terms of Service</Text>
            {" "}and{" "}
            <Text style={{ color: colors.primary }}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  heroContent: { alignItems: "center", gap: 24 },
  logoWrap: { marginBottom: 4 },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  heroText: { alignItems: "center", gap: 4 },
  heroTitle: {
    fontSize: 44,
    fontFamily: "Inter_700Bold",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: -1.5,
    lineHeight: 48,
    textAlign: "center",
  },
  heroTitleAccent: {
    fontSize: 44,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: -1.5,
    lineHeight: 50,
    textAlign: "center",
  },
  heroSub: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 8,
    width: "100%",
  },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
  bottom: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { flex: 1, gap: 2 },
  featureLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold", letterSpacing: -0.2 },
  featureSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  ctaSection: { marginTop: 4, gap: 12 },
  terms: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
  },
});
