import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";
import { fadeInDownDelay, fadeInDownIndexed } from "@/constants/animations";

const TERMS = [
  "I agree to deliver orders within the committed time frame",
  "I will handle products with care and responsibility",
  "I will maintain professional conduct with customers and shops",
  "I agree to the Bringo Agent Code of Conduct",
  "I confirm all submitted documents are authentic and valid",
  "I accept the payout schedule and commission structure",
];

export default function TermsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuthStore();
  const [accepted, setAccepted] = useState<Set<number>>(new Set());
  const allAccepted = accepted.size === TERMS.length;

  const toggle = (i: number) => {
    setAccepted((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleSubmit = () => {
    completeOnboarding();
    router.replace("/(onboarding)/kyc-review");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Terms & Conditions" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Animated.View entering={fadeInDownDelay(100)} style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Accept Terms</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>Please read and accept all terms before submitting your application</Text>
        </Animated.View>
        <View style={styles.terms}>
          {TERMS.map((term, i) => (
            <Animated.View key={i} entering={fadeInDownIndexed(200, i)}>
              <Pressable onPress={() => toggle(i)} style={[styles.termRow, { backgroundColor: colors.card, borderColor: accepted.has(i) ? colors.success : colors.border, borderRadius: colors.radiusSm }]}>
                <View style={[styles.checkbox, { backgroundColor: accepted.has(i) ? colors.success : "transparent", borderColor: accepted.has(i) ? colors.success : colors.border }]}>
                  {accepted.has(i) && <Feather name="check" size={13} color="#FFF" />}
                </View>
                <Text style={[styles.termText, { color: colors.foreground }]}>{term}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
        <Pressable onPress={() => setAccepted(allAccepted ? new Set() : new Set(TERMS.map((_, i) => i)))} style={[styles.selectAll, { borderColor: colors.primary, borderRadius: colors.radiusSm }]}>
          <Text style={[styles.selectAllText, { color: colors.primary }]}>{allAccepted ? "Deselect All" : "Accept All"}</Text>
        </Pressable>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Submit Application" onPress={handleSubmit} disabled={!allAccepted} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 16 },
  header: { gap: 8 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  terms: { gap: 10 },
  termRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14, borderWidth: 1 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, alignItems: "center", justifyContent: "center", marginTop: 1 },
  termText: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 22 },
  selectAll: { alignItems: "center", padding: 14, borderWidth: 1.5 },
  selectAllText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});
