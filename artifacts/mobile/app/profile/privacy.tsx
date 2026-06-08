import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function PrivacyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Privacy Policy" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Privacy Policy</Text>
        <Text style={[styles.date, { color: colors.mutedForeground }]}>Last updated: January 2024</Text>
        {["Data Collection", "How We Use Your Data", "Data Security", "Your Rights", "Contact Us"].map((section) => (
          <View key={section} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{section}</Text>
            <Text style={[styles.sectionText, { color: colors.mutedForeground }]}>
              Bringo collects and processes your personal data in accordance with applicable data protection laws. We take your privacy seriously and are committed to protecting your information.
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 20 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  date: { fontSize: 13, fontFamily: "Inter_400Regular" },
  section: { gap: 8 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: -0.2 },
  sectionText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 24 },
});
