import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { DocumentUpload } from "@/components/common/DocumentUpload";
import { useColors } from "@/hooks/useColors";

export default function AadhaarFrontScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [uri, setUri] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Aadhaar Card" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Aadhaar — Front Side</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Take a clear photo of the front side of your Aadhaar card. All details must be clearly visible.
          </Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <DocumentUpload label="Front Side" hint="Photo with your name, photo, DOB, and Aadhaar number" onSelect={setUri} />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={[styles.infoBox, { backgroundColor: colors.muted, borderRadius: colors.radiusSm }]}>
          <Text style={[styles.infoTitle, { color: colors.foreground }]}>Guidelines</Text>
          {["Place card on a flat surface", "Ensure all text is readable", "Avoid glare or shadows", "Image should not be cropped"].map((g) => (
            <Text key={g} style={[styles.guideline, { color: colors.mutedForeground }]}>• {g}</Text>
          ))}
        </Animated.View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Continue" onPress={() => router.push("/(onboarding)/aadhaar-back")} disabled={!uri} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 20 },
  header: { gap: 8 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  infoBox: { padding: 16, gap: 8 },
  infoTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  guideline: { fontSize: 13, fontFamily: "Inter_400Regular" },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});
