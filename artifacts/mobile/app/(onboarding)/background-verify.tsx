import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { fadeInDownDelay, fadeInDownIndexed } from "@/constants/animations";

const CHECKS = [
  { icon: "shield", label: "Criminal Background Check", desc: "Automated police record verification" },
  { icon: "user-check", label: "Identity Verification", desc: "Aadhaar & PAN cross-verification" },
  { icon: "file-text", label: "Document Authenticity", desc: "AI-powered document validation" },
  { icon: "star", label: "Address Verification", desc: "Physical address confirmation" },
];

export default function BackgroundVerifyScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Background Check" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Animated.View entering={fadeInDownDelay(100)} style={styles.header}>
          <View style={[styles.iconBig, { backgroundColor: colors.primaryLight }]}>
            <Feather name="shield" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Background Verification</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>We run automated checks to ensure the safety of our platform</Text>
        </Animated.View>
        {CHECKS.map((c, i) => (
          <Animated.View key={c.label} entering={fadeInDownIndexed(200, i)} style={[styles.checkCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radiusSm }]}>
            <View style={[styles.checkIcon, { backgroundColor: colors.primaryLight }]}>
              <Feather name={c.icon as any} size={20} color={colors.primary} />
            </View>
            <View style={styles.checkText}>
              <Text style={[styles.checkLabel, { color: colors.foreground }]}>{c.label}</Text>
              <Text style={[styles.checkDesc, { color: colors.mutedForeground }]}>{c.desc}</Text>
            </View>
            <Feather name="check-circle" size={18} color={colors.success} />
          </Animated.View>
        ))}
        <Animated.View entering={fadeInDownDelay(600)} style={[styles.note, { backgroundColor: colors.accentLight, borderRadius: colors.radiusSm }]}>
          <Feather name="clock" size={14} color={colors.accent} />
          <Text style={[styles.noteText, { color: colors.foreground }]}>Takes 24–48 hours. You'll be notified via SMS and app once done.</Text>
        </Animated.View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Accept & Continue" onPress={() => router.push("/(onboarding)/terms")} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 16 },
  header: { alignItems: "center", gap: 10, marginBottom: 8 },
  iconBig: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.6, textAlign: "center" },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, textAlign: "center" },
  checkCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderWidth: 1 },
  checkIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  checkText: { flex: 1, gap: 2 },
  checkLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  checkDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  note: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12 },
  noteText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});
