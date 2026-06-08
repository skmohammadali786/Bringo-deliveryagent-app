import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { DocumentUpload } from "@/components/common/DocumentUpload";
import { useColors } from "@/hooks/useColors";
import { useAuthStore } from "@/store/authStore";

export default function VehicleRcScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setAgent = useAuthStore((s) => s.setAgent);
  const [regNum, setRegNum] = useState("");
  const [uri, setUri] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Vehicle RC" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.foreground }]}>Vehicle Registration</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>Enter your vehicle registration number and upload the RC</Text>
        <Input label="Registration Number" placeholder="KA 01 AB 1234" value={regNum} onChangeText={(t) => { setRegNum(t.toUpperCase()); setAgent({ vehicleNumber: t.toUpperCase() }); }} autoCapitalize="characters" />
        <DocumentUpload label="RC Book / Certificate" hint="Registration certificate front page" onSelect={setUri} />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Continue" onPress={() => router.push("/(onboarding)/insurance")} disabled={!regNum || !uri} size="xl" />
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
