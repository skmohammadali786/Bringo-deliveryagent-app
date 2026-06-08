import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";

const STEPS = [
  { icon: "user", label: "Personal Info", desc: "Basic details & photo" },
  { icon: "file-text", label: "KYC Documents", desc: "Aadhaar, PAN, Licence" },
  { icon: "credit-card", label: "Bank Details", desc: "For seamless payouts" },
  { icon: "check-circle", label: "Verification", desc: "Background & selfie" },
];

export default function AgentIntroScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === "web" ? 60 : 60) }]}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Complete Your{"\n"}Agent Profile
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Quick 4-step process to start earning with Bringo
          </Text>
        </Animated.View>

        <View style={styles.steps}>
          {STEPS.map((step, i) => (
            <Animated.View
              key={step.label}
              entering={FadeInDown.delay(200 + i * 100).duration(500)}
              style={[
                styles.stepCard,
                { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm },
              ]}
            >
              <View style={[styles.stepNum, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.stepNumText, { color: colors.primary }]}>{i + 1}</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepLabel, { color: colors.foreground }]}>{step.label}</Text>
                <Text style={[styles.stepDesc, { color: colors.mutedForeground }]}>{step.desc}</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Animated.View>
          ))}
        </View>

        <Animated.View
          entering={FadeInDown.delay(700).duration(500)}
          style={[styles.infoBox, { backgroundColor: colors.accentLight, borderRadius: colors.radiusSm }]}
        >
          <Feather name="zap" size={16} color={colors.accent} />
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            Takes only 10 minutes. Approval within 24 hours.
          </Text>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.delay(800).duration(500)}
        style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}
      >
        <Button
          title="Start Registration"
          onPress={() => router.push("/(onboarding)/vehicle-type")}
          size="xl"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, gap: 28 },
  header: { gap: 8 },
  title: { fontSize: 34, fontFamily: "Inter_700Bold", letterSpacing: -1.2, lineHeight: 40 },
  subtitle: { fontSize: 16, fontFamily: "Inter_400Regular", lineHeight: 24 },
  steps: { gap: 10 },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1,
  },
  stepNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  stepInfo: { flex: 1, gap: 2 },
  stepLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold", letterSpacing: -0.2 },
  stepDesc: { fontSize: 13, fontFamily: "Inter_400Regular" },
  infoBox: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14 },
  infoText: { fontSize: 14, fontFamily: "Inter_500Medium", flex: 1 },
  footer: { paddingHorizontal: 24 },
});
