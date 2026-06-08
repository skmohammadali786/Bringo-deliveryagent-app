import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { DocumentUpload } from "@/components/common/DocumentUpload";
import { useColors } from "@/hooks/useColors";

export default function PanScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [panNum, setPanNum] = useState("");
  const [uri, setUri] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="PAN Card" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.foreground }]}>PAN Card Details</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>Required for tax compliance and payouts above ₹10,000/month</Text>
        <Input label="PAN Number" placeholder="ABCDE1234F" value={panNum} onChangeText={(t) => setPanNum(t.toUpperCase().slice(0, 10))} autoCapitalize="characters" hint="10-character alphanumeric PAN number" />
        <DocumentUpload label="PAN Card Photo" hint="Clear photo of your PAN card" onSelect={setUri} />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Continue" onPress={() => router.push("/(onboarding)/dl-front")} disabled={panNum.length !== 10 || !uri} size="xl" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 20 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6, marginTop: 8 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, marginBottom: 4 },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});
