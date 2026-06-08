import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { DocumentUpload } from "@/components/common/DocumentUpload";
import { useColors } from "@/hooks/useColors";

export default function AadhaarBackScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [uri, setUri] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Aadhaar Card" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Aadhaar — Back Side</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>Photo of the back side showing address</Text>
        <DocumentUpload label="Back Side" hint="Photo with your address details" onSelect={setUri} />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Continue" onPress={() => router.push("/(onboarding)/pan")} disabled={!uri} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 20 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6, marginTop: 8 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});
