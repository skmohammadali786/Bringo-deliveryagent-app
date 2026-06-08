import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function UpiDetailsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [upi, setUpi] = useState("");

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScreenHeader title="UPI Details" showBack />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 20 : 0 }]} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.foreground }]}>UPI ID (Optional)</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>Add your UPI ID for instant withdrawals. You can skip this and add later.</Text>
        <Input label="UPI ID" placeholder="yourname@upi" value={upi} onChangeText={setUpi} autoCapitalize="none" keyboardType="email-address" hint="e.g. 9876543210@paytm, name@gpay" />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24, backgroundColor: colors.background }]}>
        <Button title="Continue" onPress={() => router.push("/(onboarding)/emergency-contact")} size="xl" />
        <Button title="Skip for now" onPress={() => router.push("/(onboarding)/emergency-contact")} variant="ghost" size="md" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, gap: 20 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.6, marginTop: 8 },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  footer: { paddingHorizontal: 24, paddingTop: 12, gap: 8 },
});
