import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";

const FEATURES = [
  { icon: "package" as const, label: "Pick & deliver orders", color: "#FF6B35" },
  { icon: "trending-up" as const, label: "Track your earnings", color: "#34C759" },
  { icon: "shield" as const, label: "Safe & insured delivery", color: "#007AFF" },
];

export default function WelcomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#FF6B35", "#FF8C5A", colors.background]}
        style={[styles.hero, { paddingTop: insets.top + (Platform.OS === "web" ? 60 : 60) }]}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.heroContent}>
          <View style={styles.heroIconRow}>
            <MaterialCommunityIcons name="moped" size={64} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>Start Earning{"\n"}With Bringo</Text>
          <Text style={styles.heroSub}>
            Join 50,000+ delivery partners earning daily
          </Text>
        </Animated.View>
      </LinearGradient>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 32 }]}>
        {FEATURES.map((f, i) => (
          <Animated.View
            key={f.label}
            entering={FadeInUp.delay(200 + i * 100).duration(500)}
            style={[styles.feature, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.featureIcon, { backgroundColor: f.color + "18" }]}>
              <Feather name={f.icon} size={18} color={f.color} />
            </View>
            <Text style={[styles.featureLabel, { color: colors.foreground }]}>{f.label}</Text>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.btns}>
          <Button
            title="Get Started"
            onPress={() => router.push("/(auth)/login")}
            size="xl"
          />
          <Text style={[styles.terms, { color: colors.mutedForeground }]}>
            By continuing, you agree to our Terms & Privacy Policy
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
  heroContent: { alignItems: "center", gap: 12 },
  heroIconRow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -1.2,
    lineHeight: 42,
  },
  heroSub: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },
  bottom: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featureLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    letterSpacing: -0.2,
  },
  btns: { marginTop: 8, gap: 12 },
  terms: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
  },
});
