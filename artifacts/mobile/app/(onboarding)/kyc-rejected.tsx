import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";
import { fadeInDownDelay } from "@/constants/animations";

const REASONS = [
  "Document photo was blurry or unclear",
  "Information mismatch between documents",
  "Invalid or expired document uploaded",
];

export default function KycRejectedScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setKycStatus, setOnboardingStep } = useAuthStore();

  const handleReapply = () => {
    setKycStatus("not_started");
    setOnboardingStep("documents");
    router.replace("/(onboarding)/aadhaar-front");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === "web" ? 80 : 100) }]}>
        <Animated.View entering={fadeInDownDelay(100)} style={styles.center}>
          <View style={[styles.iconWrap, { backgroundColor: colors.destructiveLight }]}>
            <Feather name="x" size={56} color={colors.destructive} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>KYC Rejected</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            We were unable to verify your documents. Please re-upload and try again.
          </Text>
        </Animated.View>
        <Animated.View entering={fadeInDownDelay(300)} style={[styles.reasonsBox, { backgroundColor: colors.destructiveLight, borderRadius: colors.radius }]}>
          <Text style={[styles.reasonsTitle, { color: colors.destructive }]}>Common Reasons for Rejection</Text>
          {REASONS.map((r) => (
            <View key={r} style={styles.reason}>
              <Feather name="alert-circle" size={14} color={colors.destructive} />
              <Text style={[styles.reasonText, { color: colors.foreground }]}>{r}</Text>
            </View>
          ))}
        </Animated.View>
        <Animated.View entering={fadeInDownDelay(500)} style={[styles.supportBox, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
          <Feather name="headphones" size={18} color={colors.primary} />
          <Text style={[styles.supportText, { color: colors.mutedForeground }]}>
            Need help? Contact our support team at support@bringo.in
          </Text>
        </Animated.View>
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}>
        <Button title="Re-upload Documents" onPress={handleReapply} size="xl" />
        <Button title="Contact Support" onPress={() => router.push("/support/" as any)} variant="outline" size="md" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, gap: 28 },
  center: { alignItems: "center", gap: 16 },
  iconWrap: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.8, textAlign: "center" },
  sub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
  reasonsBox: { padding: 16, gap: 10 },
  reasonsTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  reason: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  reasonText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  supportBox: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, borderWidth: 1 },
  supportText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  footer: { paddingHorizontal: 24, gap: 8 },
});
