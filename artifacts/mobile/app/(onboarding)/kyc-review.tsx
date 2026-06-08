import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";

export default function KycReviewScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setKycStatus } = useAuthStore();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 3000 }), -1, false);
    // Simulate KYC approval after 5 seconds for demo
    const t = setTimeout(() => {
      setKycStatus("approved");
    }, 100000);
    return () => clearTimeout(t);
  }, []);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === "web" ? 80 : 80) }]}>
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.center}>
          <View style={[styles.iconWrap, { backgroundColor: colors.warningLight }]}>
            <Animated.View style={spinStyle}>
              <Feather name="loader" size={48} color={colors.warning} />
            </Animated.View>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>KYC Under Review</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Your application is being reviewed by our team. This usually takes 24–48 hours.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.timeline}>
          {[
            { icon: "check-circle", label: "Application Submitted", done: true },
            { icon: "loader", label: "Document Verification", active: true },
            { icon: "shield", label: "Background Check", pending: true },
            { icon: "star", label: "Final Approval", pending: true },
          ].map((step, i) => (
            <View key={step.label} style={styles.timelineStep}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, { backgroundColor: step.done ? colors.success : step.active ? colors.warning : colors.muted }]}>
                  <Feather name={step.done ? "check" : step.active ? "loader" : "circle"} size={14} color={step.done || step.active ? "#FFF" : colors.mutedForeground} />
                </View>
                {i < 3 && <View style={[styles.timelineLine, { backgroundColor: step.done ? colors.success : colors.muted }]} />}
              </View>
              <Text style={[styles.timelineLabel, { color: step.done ? colors.success : step.active ? colors.warning : colors.mutedForeground }]}>
                {step.label}
              </Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={[styles.infoBox, { backgroundColor: colors.primaryLight, borderRadius: colors.radius }]}>
          <Feather name="bell" size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary }]}>
            You'll receive an SMS and app notification once your KYC is approved
          </Text>
        </Animated.View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}>
        <Button title="KYC Approved (Demo)" onPress={() => { setKycStatus("approved"); router.replace("/(tabs)/"); }} variant="primary" size="xl" />
        <Button title="KYC Rejected (Demo)" onPress={() => { setKycStatus("rejected"); router.replace("/(onboarding)/kyc-rejected"); }} variant="outline" size="md" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, gap: 32 },
  center: { alignItems: "center", gap: 16 },
  iconWrap: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.8, textAlign: "center" },
  sub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
  timeline: { gap: 0 },
  timelineStep: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 0 },
  timelineLeft: { alignItems: "center", gap: 0 },
  timelineDot: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  timelineLine: { width: 2, height: 24, marginTop: 2 },
  timelineLabel: { fontSize: 14, fontFamily: "Inter_500Medium", paddingTop: 6 },
  infoBox: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14 },
  infoText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  footer: { paddingHorizontal: 24, gap: 8 },
});
